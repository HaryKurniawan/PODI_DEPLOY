// File: scripts/seedImmunization.js

const prisma = require('../src/config/prisma');


const immunizationData = [
  {
    rentangUsia: '0-1 Bulan',
    usiaInBulan: 0,
    vaksin: [
      { nama: 'HB-0 (Hepatitis B)', dosis: '0', deskripsi: 'Vaksin awal untuk Hepatitis B', usiaRekomendasi: '0 hari' }
    ]
  },
  {
    rentangUsia: '1-2 Bulan',
    usiaInBulan: 1,
    vaksin: [
      { nama: 'Polio 1', dosis: '1', deskripsi: 'Vaksin polio dosis pertama', usiaRekomendasi: '4 minggu' },
      { nama: 'DPT-HB-Hib 1', dosis: '1', deskripsi: 'Kombinasi vaksin pertama', usiaRekomendasi: '4 minggu' }
    ]
  },
  {
    rentangUsia: '2-3 Bulan',
    usiaInBulan: 2,
    vaksin: [
      { nama: 'Polio 2', dosis: '2', deskripsi: 'Vaksin polio dosis kedua', usiaRekomendasi: '8 minggu' },
      { nama: 'DPT-HB-Hib 2', dosis: '2', deskripsi: 'Kombinasi vaksin kedua', usiaRekomendasi: '8 minggu' }
    ]
  },
  {
    rentangUsia: '3-4 Bulan',
    usiaInBulan: 3,
    vaksin: [
      { nama: 'Polio 3', dosis: '3', deskripsi: 'Vaksin polio dosis ketiga', usiaRekomendasi: '12 minggu' },
      { nama: 'DPT-HB-Hib 3', dosis: '3', deskripsi: 'Kombinasi vaksin ketiga', usiaRekomendasi: '12 minggu' }
    ]
  },
  {
    rentangUsia: '6 Bulan',
    usiaInBulan: 6,
    vaksin: [
      { nama: 'Polio 4 (Booster)', dosis: '4', deskripsi: 'Booster polio', usiaRekomendasi: '6 bulan' },
      { nama: 'HB Booster', dosis: 'Booster', deskripsi: 'Booster Hepatitis B', usiaRekomendasi: '6 bulan' }
    ]
  },
  {
    rentangUsia: '12 Bulan',
    usiaInBulan: 12,
    vaksin: [
      { nama: 'Campak/MR 1', dosis: '1', deskripsi: 'Campak/MR dosis 1', usiaRekomendasi: '12 bulan' },
      { nama: 'DPT Booster 1', dosis: 'Booster 1', deskripsi: 'Booster DPT pertama', usiaRekomendasi: '12 bulan' }
    ]
  },
  {
    rentangUsia: '18 Bulan',
    usiaInBulan: 18,
    vaksin: [
      { nama: 'Polio Booster', dosis: 'Booster', deskripsi: 'Booster polio kedua', usiaRekomendasi: '18 bulan' },
      { nama: 'DPT Booster 2', dosis: 'Booster 2', deskripsi: 'Booster DPT kedua', usiaRekomendasi: '18 bulan' }
    ]
  },
  {
    rentangUsia: '24 Bulan',
    usiaInBulan: 24,
    vaksin: [
      { nama: 'Tifoid (Typhim Vi)', dosis: '1', deskripsi: 'Vaksin Tifoid', usiaRekomendasi: '24 bulan' }
    ]
  }
];

async function seedImmunization() {
  try {
    console.log('\n🌱 Starting immunization seeding...\n');

    // HAPUS FK CHILD DULU
    await prisma.imunisasiAnak.deleteMany();
    console.log('🧹 Deleted ImunisasiAnak');

    await prisma.vaksinImunisasi.deleteMany();
    console.log('🧹 Deleted VaksinImunisasi');

    await prisma.templateImunisasi.deleteMany();
    console.log('🧹 Deleted TemplateImunisasi');

    console.log('➡ Creating templates...');

    for (const template of immunizationData) {
      const created = await prisma.templateImunisasi.create({
        data: {
          rentangUsia: template.rentangUsia,
          usiaInBulan: template.usiaInBulan,
          vaksin: {
            create: template.vaksin
          }
        },
        include: { vaksin: true }
      });

      console.log(`✔ ${created.rentangUsia} → ${created.vaksin.length} vaccines`);
    }

    console.log('\n✨ Seeding immunization DONE!\n');

  } catch (err) {
    console.error('❌ Seeding ERROR:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedImmunization();
}

module.exports = seedImmunization;
