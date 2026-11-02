const { updateHomeDashboardCache } = require('./services/dashboardService');

async function run() {
  console.log("🌱 Pre-computing Home Dashboard snapshot...");
  await updateHomeDashboardCache();
  process.exit(0);
}

run();