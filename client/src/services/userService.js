import { db } from '../config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Fetch or initialize default user profile
 */
export async function getOrCreateUserProfile(userId = 'user_test_client') {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  } else {
    // Default profile template
    const newProfile = {
      displayName: 'Alex Developer',
      email: 'alex.dev@example.com',
      studentId: 'DEV-88492',
      totalExp: 0,
      roleExp: {
        QA: 0,
        Tester: 0,
        Programmer: 0,
      },
      highScores: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, newProfile);
    return { id: userId, ...newProfile };
  }
}

/**
 * Record a completed sprint attempt and update EXP / High Scores atomically
 */
export async function recordSprintAttempt({
  userId = 'user_test_client',
  scenarioId,
  scenarioTitle,
  role,
  score,
  healthStatus,
  moraleStatus,
}) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await getOrCreateUserProfile(userId);
  }

  const userData = (await getDoc(userRef)).data();

  // 1. Calculate EXP Delta (Difference between new score and previous high score)
  const scoreKey = `${scenarioId}_${role}`;
  const previousHighScore = userData.highScores?.[scoreKey] || 0;
  const expDelta = Math.max(0, score - previousHighScore);

  const updatedTotalExp = (userData.totalExp || 0) + expDelta;
  const updatedRoleExp = {
    ...userData.roleExp,
    [role]: (userData.roleExp?.[role] || 0) + expDelta,
  };
  const updatedHighScores = {
    ...userData.highScores,
    [scoreKey]: Math.max(previousHighScore, score),
  };

  // 2. Update user root document
  await updateDoc(userRef, {
    totalExp: updatedTotalExp,
    roleExp: updatedRoleExp,
    highScores: updatedHighScores,
    updatedAt: serverTimestamp(),
  });

  // 3. Save attempt audit log into users/{userId}/attempts sub-collection
  const attemptsRef = collection(db, 'users', userId, 'attempts');
  await addDoc(attemptsRef, {
    scenarioId,
    scenarioTitle,
    role,
    score,
    previousHighScore,
    expDelta,
    healthStatus,
    moraleStatus,
    completedAt: serverTimestamp(),
  });

  return {
    expDelta,
    newTotalExp: updatedTotalExp,
    newRoleExp: updatedRoleExp[role],
    newHighScore: updatedHighScores[scoreKey],
  };
}