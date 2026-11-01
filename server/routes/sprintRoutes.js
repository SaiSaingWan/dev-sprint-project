const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');

// POST /api/sprint/submit
router.post('/submit', async (req, res) => {
  const { userId, scenarioId, role, answers, score, timeTakenSeconds } = req.body;

  if (!userId || !scenarioId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      // Create default user profile if it doesn't exist yet
      const userData = userDoc.exists ? userDoc.data() : {
        uid: userId,
        displayName: 'Student Player',
        totalExp: 0,
        roleExp: {},
        highScores: {}
      };

      const highScoreKey = `${scenarioId}_${role}`;
      const previousHighScore = userData.highScores?.[highScoreKey] || 0;

      // 1. Calculate EXP Delta
      const expDelta = Math.max(0, score - previousHighScore);
      const newHighScore = Math.max(previousHighScore, score);
      const currentRoleExp = userData.roleExp?.[role] || 0;

      // 2. Update User Profile Document
      transaction.set(userRef, {
        ...userData,
        totalExp: (userData.totalExp || 0) + expDelta,
        roleExp: {
          ...userData.roleExp,
          [role]: currentRoleExp + expDelta
        },
        highScores: {
          ...userData.highScores,
          [highScoreKey]: newHighScore
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 3. Log Attempt Entry in Sub-collection
      const attemptRef = userRef.collection('attempts').doc();
      transaction.set(attemptRef, {
        attemptId: attemptRef.id,
        scenarioId,
        role,
        score,
        previousHighScore,
        expAwarded: expDelta,
        timeTakenSeconds,
        answers: answers || [],
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { finalScore: score, expAwarded: expDelta, newHighScore };
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error submitting sprint:', error);
    res.status(500).json({ error: 'Failed to process score submission' });
  }
});

module.exports = router;