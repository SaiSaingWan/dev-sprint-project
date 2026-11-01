const { db } = require('./config/firebase');

const initialUser = {
  uid: "user_test_client",
  displayName: "Alex Developer",
  email: "alex.dev@example.com",
  studentId: "DEV-88492",
  totalExp: 1370,
  roleExp: {
    QA: 520,
    Tester: 650,
    Programmer: 200
  },
  highScores: {
    "scen_pay_001_QA": 85,
    "scen_pay_001_Tester": 60,
    "scen_scope_002_Tester": 92,
    "scen_scope_002_Programmer": 78
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

async function seedUser() {
  console.log("🌱 Creating initial user in Firestore...");

  try {
    const userRef = db.collection('users').doc(initialUser.uid);
    await userRef.set(initialUser, { merge: true });
    console.log(`✅ Seeded user profile: ${initialUser.displayName} (${initialUser.uid})`);

    // Add a sample sprint attempt log to the sub-collection
    const attemptRef = userRef.collection('attempts').doc();
    await attemptRef.set({
      scenarioId: "scen_pay_001",
      scenarioTitle: "Payment Gateway Meltdown",
      role: "QA",
      score: 85,
      previousHighScore: 0,
      expDelta: 85,
      healthStatus: "90% (STABLE)",
      moraleStatus: "CONFIDENT",
      completedAt: new Date()
    });
    console.log("✅ Seeded initial sprint attempt in sub-collection!");

    console.log("🚀 User creation complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding user:", error);
    process.exit(1);
  }
}

seedUser();