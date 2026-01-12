// backend/prisma/seed.js
const seedImmunization = require('../scripts/seedImmunization');
const seedUsers = require('../scripts/seedUsers');
const seedKPSP = require('../scripts/seedKPSP');

(async () => {
  try {
    console.log('🚀 Running Prisma seed...\n');

    // Seed Users first
    await seedUsers();

    // Seed Immunization data
    await seedImmunization();

    // Seed KPSP data
    await seedKPSP();

    console.log('🎉 All seeds completed successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
