const { db } = require('../config/firebase');

/**
 * Pre-computes latest scenario and top 5 global leaderboard
 * and saves to a single Firestore cache document: system/home_dashboard
 */
async function updateHomeDashboardCache() {
  try {
    // 1. Fetch newest scenario
    const scSnap = await db
      .collection('scenarios')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    let latestScenario = null;
    if (!scSnap.empty) {
      latestScenario = { id: scSnap.docs[0].id, ...scSnap.docs[0].data() };
    }

    // 2. Fetch top 5 players sorted by totalExp
    const lbSnap = await db
      .collection('users')
      .orderBy('totalExp', 'desc')
      .limit(5)
      .get();

    const topPlayers = [];
    lbSnap.forEach((doc) => {
      topPlayers.push({ id: doc.id, ...doc.data() });
    });

    // 3. Write pre-calculated cache snapshot into Firestore
    await db.collection('system').doc('home_dashboard').set({
      latestScenario,
      topPlayers,
      updatedAt: new Date(),
    });

    console.log('⚡ Home Dashboard cache pre-calculated successfully!');
  } catch (error) {
    console.error('❌ Error updating Home Dashboard cache:', error);
  }
}

module.exports = { updateHomeDashboardCache };