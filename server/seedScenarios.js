const { db } = require('./config/firebase');

// Helper to generate 10 questions per role
function generateRoleQuestions(roleName, focusArea) {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({
      questionId: i,
      actTitle: `ACT ${Math.ceil(i / 3)}: Phase ${i}`,
      prompt: `[${roleName}] Assessment Question #${i} (${focusArea}): How do you handle this phase of the incident?`,
      options: [
        {
          text: `A. Optimal engineering choice for ${roleName} (High impact).`,
          points: 10,
          health: "90% (STABLE)",
          morale: "CONFIDENT"
        },
        {
          text: `B. Moderate work-around for ${roleName} (Medium impact).`,
          points: 6,
          health: "60% (Degraded)",
          morale: "ANXIOUS"
        },
        {
          text: `C. Risky manual action for ${roleName} (Low/Negative impact).`,
          points: 2,
          health: "30% (Critical)",
          morale: "PANICKED"
        }
      ]
    });
  }
  return questions;
}

const scenarios = [
  {
    id: "scen_pay_001",
    title: "Payment Gateway Meltdown",
    difficulty: "Intermediate",
    timeLimitMinutes: 15,
    description: "Intermittent 500 API errors during Black Friday traffic. Handle PostgreSQL locks & Redis sync failures.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Reproduction, edge-cases, system boundaries",
        questions: generateRoleQuestions("QA Engineer", "Edge-cases & System Boundaries")
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "Automated scripts, status codes, assertion checks",
        questions: generateRoleQuestions("Software Tester", "Automation & Assertions")
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Hotfixes, DB query optimization, lock handling",
        questions: generateRoleQuestions("Programmer", "Hotfixes & Query Tuning")
      }
    }
  },
  {
    id: "scen_scope_002",
    title: "Sprint 12 Scope Creep Crisis",
    difficulty: "Beginner",
    timeLimitMinutes: 10,
    description: "Stakeholders request 5 unbudgeted features 2 days before release. Balance scope & regression.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Regression test coverage",
        questions: generateRoleQuestions("QA Engineer", "Regression Coverage")
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "Smoke test automation",
        questions: generateRoleQuestions("Software Tester", "Automated Smoke Tests")
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Feature flags & debt isolation",
        questions: generateRoleQuestions("Programmer", "Feature Flags")
      }
    }
  },
  {
    id: "scen_db_003",
    title: "Database Migration Lockout",
    difficulty: "Advanced",
    timeLimitMinutes: 20,
    description: "Unindexed schema migration locks production DB. Balance zero-downtime hotfixes and stakeholder comms.",
    active: true,
    roles: {
      QA: {
        roleTitle: "QA Engineer",
        focus: "Schema contract verification",
        questions: generateRoleQuestions("QA Engineer", "Schema Contracts")
      },
      Tester: {
        roleTitle: "Software Tester",
        focus: "DB integrity testing",
        questions: generateRoleQuestions("Software Tester", "Data Integrity")
      },
      Programmer: {
        roleTitle: "Programmer / Developer",
        focus: "Index creation & non-blocking migrations",
        questions: generateRoleQuestions("Programmer", "Zero-downtime Migrations")
      }
    }
  }
];

async function seedDatabase() {
  console.log("🌱 Seeding Firestore with 10-Question Role Scenarios...");

  try {
    for (const scenario of scenarios) {
      const docRef = db.collection('scenarios').doc(scenario.id);
      await docRef.set(scenario, { merge: true });
      console.log(`✅ Seeded: ${scenario.title} (${scenario.id}) [3 Roles x 10 Questions]`);
    }
    console.log("🚀 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();