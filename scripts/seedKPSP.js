const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedKPSP() {
  console.log('Seeding KPSP data...');

  // SEED DEVELOPMENT AREAS DULU
  console.log('Seeding Development Areas...');
  const developmentAreas = [
    { nama: 'Motorik Kasar', deskripsi: 'Kemampuan gerakan tubuh yang melibatkan otot-otot besar' },
    { nama: 'Motorik Halus', deskripsi: 'Kemampuan gerakan yang melibatkan otot-otot kecil dan koordinasi mata-tangan' },
    { nama: 'Bahasa', deskripsi: 'Kemampuan berbicara, memahami, dan berkomunikasi' },
    { nama: 'Sosialisasi & Kemandirian', deskripsi: 'Kemampuan berinteraksi sosial dan melakukan aktivitas secara mandiri' }
  ];

  for (const area of developmentAreas) {
    await prisma.areaPerkembangan.upsert({
      where: { nama: area.nama },
      update: { deskripsi: area.deskripsi, aktif: true },
      create: { nama: area.nama, deskripsi: area.deskripsi, aktif: true }
    });
  }
  console.log(`Seeded ${developmentAreas.length} development areas`);

  // BERSIHKAN DATA KPSP DULU
  console.log('Clearing existing KPSP data...');
  await prisma.pertanyaanKPSP?.deleteMany?.();
  await prisma.kategoriUsiaKPSP.deleteMany();

  // KPSP 0-6 Bulan
  const category0_6 = await prisma.kategoriUsiaKPSP.create({
    data: {
      kode: 'KPSP_0_6',
      nama: 'KPSP 0-6 Bulan',
      usiaMinBulan: 0,
      usiaMaxBulan: 5,
      deskripsi: 'Kuesioner Pra Skrining Perkembangan untuk anak usia 0-6 bulan',
      aktif: true,
      pertanyaan: {
        create: [
          {
            nomorPertanyaan: 1,
            teksPertanyaan: 'Apakah bayi bereaksi terhadap suara keras?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Perhatikan apakah bayi kaget atau berhenti bergerak'
          },
          {
            nomorPertanyaan: 2,
            teksPertanyaan: 'Apakah bayi dapat menatap wajah Anda?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Dekatkan wajah Anda sekitar 30 cm'
          },
          {
            nomorPertanyaan: 3,
            teksPertanyaan: 'Apakah bayi dapat mengikuti benda bergerak dengan matanya?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Gerakkan benda dari kiri ke kanan'
          },
          {
            nomorPertanyaan: 4,
            teksPertanyaan: 'Apakah bayi dapat mengangkat kepala saat ditengkurapkan?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Letakkan bayi tengkurap di alas yang datar'
          },
          {
            nomorPertanyaan: 5,
            teksPertanyaan: 'Apakah bayi mengeluarkan suara seperti "ooo" atau "aaa"?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Dengarkan suara ocehan bayi'
          },
          {
            nomorPertanyaan: 6,
            teksPertanyaan: 'Apakah bayi tersenyum ketika diajak berinteraksi?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Ajak bayi berbicara atau tersenyum'
          },
          {
            nomorPertanyaan: 7,
            teksPertanyaan: 'Apakah bayi dapat menggenggam jari atau benda yang disentuhkan?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Sentuhkan jari atau mainan kecil ke telapak tangan bayi'
          },
          {
            nomorPertanyaan: 8,
            teksPertanyaan: 'Apakah bayi dapat menggerakkan kedua tangan dan kaki secara aktif?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Amati gerakan spontan bayi'
          },
          {
            nomorPertanyaan: 9,
            teksPertanyaan: 'Apakah bayi menunjukkan respon saat dipanggil?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Panggil nama bayi dari arah yang berbeda'
          },
          {
            nomorPertanyaan: 10,
            teksPertanyaan: 'Apakah bayi mulai mencoba meraih benda di depannya?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Letakkan benda warna-warni di depannya'
          }
        ]
      }
    }
  });

  // KPSP 6-12 Bulan
  const category6_12 = await prisma.kategoriUsiaKPSP.create({
    data: {
      kode: 'KPSP_6_12',
      nama: 'KPSP 6-12 Bulan',
      usiaMinBulan: 6,
      usiaMaxBulan: 11,
      deskripsi: 'Kuesioner Pra Skrining Perkembangan untuk anak usia 6-12 bulan',
      aktif: true,
      pertanyaan: {
        create: [
          {
            nomorPertanyaan: 1,
            teksPertanyaan: 'Pada waktu bayi telentang, apakah masih ada lengan dan tungkai bergerak dengan mudah?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Perhatikan gerakan spontan bayi'
          },
          {
            nomorPertanyaan: 2,
            teksPertanyaan: 'Apakah bayi sudah bisa memegang benda kecil dengan ibu jari dan jari telunjuk?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Gunakan benda kecil seperti kismis'
          },
          {
            nomorPertanyaan: 3,
            teksPertanyaan: 'Apakah bayi sudah bisa menoleh ke arah suara?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Panggil nama bayi dari samping'
          },
          {
            nomorPertanyaan: 4,
            teksPertanyaan: 'Apakah bayi sudah bisa duduk tanpa disangga?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Duduk sendiri minimal 30 detik'
          },
          {
            nomorPertanyaan: 5,
            teksPertanyaan: 'Apakah bayi sudah bisa berdiri dengan bantuan?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Pegang kedua tangan bayi'
          },
          {
            nomorPertanyaan: 6,
            teksPertanyaan: 'Apakah bayi sudah bisa mengucapkan suku kata seperti "ba-ba" atau "ma-ma"?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Dengarkan ocehan bayi'
          },
          {
            nomorPertanyaan: 7,
            teksPertanyaan: 'Apakah bayi sudah bisa melambaikan tangan sebagai isyarat selamat tinggal?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Ajari dengan memberikan contoh'
          },
          {
            nomorPertanyaan: 8,
            teksPertanyaan: 'Apakah bayi sudah bisa mencari benda yang jatuh?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Jatuhkan mainan di depan bayi'
          },
          {
            nomorPertanyaan: 9,
            teksPertanyaan: 'Apakah bayi sudah bisa menunjuk benda dengan jari telunjuk?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Lihat apakah bayi menunjuk sesuatu'
          },
          {
            nomorPertanyaan: 10,
            teksPertanyaan: 'Apakah bayi sudah bisa bermain tepuk tangan?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Ajak bayi bertepuk tangan'
          }
        ]
      }
    }
  });

  // KPSP 12-18 Bulan
  const category12_18 = await prisma.kategoriUsiaKPSP.create({
    data: {
      kode: 'KPSP_12_18',
      nama: 'KPSP 12-18 Bulan',
      usiaMinBulan: 12,
      usiaMaxBulan: 17,
      deskripsi: 'Kuesioner Pra Skrining Perkembangan untuk anak usia 12-18 bulan',
      aktif: true,
      pertanyaan: {
        create: [
          {
            nomorPertanyaan: 1,
            teksPertanyaan: 'Apakah bayi sudah bisa berdiri sendiri tanpa bantuan?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Minimal berdiri 2 detik'
          },
          {
            nomorPertanyaan: 2,
            teksPertanyaan: 'Apakah bayi sudah bisa berjalan beberapa langkah?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Minimal 5 langkah tanpa pegangan'
          },
          {
            nomorPertanyaan: 3,
            teksPertanyaan: 'Apakah bayi sudah bisa menyebutkan 3 kata yang bermakna?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Selain papa dan mama'
          },
          {
            nomorPertanyaan: 4,
            teksPertanyaan: 'Apakah bayi sudah bisa memahami 10 perintah sederhana?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Seperti "ambil bola", "berikan pada mama"'
          },
          {
            nomorPertanyaan: 5,
            teksPertanyaan: 'Apakah bayi sudah bisa menyusun 2 balok?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Tumpuk balok tanpa jatuh'
          },
          {
            nomorPertanyaan: 6,
            teksPertanyaan: 'Apakah bayi sudah bisa meminum dari cangkir sendiri?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Pegang dan minum tanpa tumpah'
          },
          {
            nomorPertanyaan: 7,
            teksPertanyaan: 'Apakah bayi sudah bisa menunjuk gambar di buku?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Tunjuk dengan jari telunjuk'
          },
          {
            nomorPertanyaan: 8,
            teksPertanyaan: 'Apakah bayi sudah bisa menggambar goresan?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Beri crayon dan kertas'
          },
          {
            nomorPertanyaan: 9,
            teksPertanyaan: 'Apakah bayi sudah bisa bermain dengan mainan bergerak?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Seperti mendorong mobil-mobilan'
          },
          {
            nomorPertanyaan: 10,
            teksPertanyaan: 'Apakah bayi sudah bisa menunjuk beberapa bagian tubuhnya?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Minimal 3 bagian tubuh'
          }
        ]
      }
    }
  });

  // KPSP 18-24 Bulan
  const category18_24 = await prisma.kategoriUsiaKPSP.create({
    data: {
      kode: 'KPSP_18_24',
      nama: 'KPSP 18-24 Bulan',
      usiaMinBulan: 18,
      usiaMaxBulan: 24,
      deskripsi: 'Kuesioner Pra Skrining Perkembangan untuk anak usia 18-24 bulan',
      aktif: true,
      pertanyaan: {
        create: [
          {
            nomorPertanyaan: 1,
            teksPertanyaan: 'Apakah anak sudah bisa berjalan menaiki tangga?',
            areaPerkembangan: 'Motorik Kasar',
            instruksi: 'Dengan atau tanpa pegangan'
          },
          {
            nomorPertanyaan: 2,
            teksPertanyaan: 'Apakah anak sudah bisa mengatakan minimal 50 kata?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Hitung semua kata yang diucapkan'
          },
          {
            nomorPertanyaan: 3,
            teksPertanyaan: 'Apakah anak sudah bisa membuat kalimat 2 kata?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Seperti "mau makan", "mama pergi"'
          },
          {
            nomorPertanyaan: 4,
            teksPertanyaan: 'Apakah anak sudah bisa bermain dengan mainan sambil membayangkan permainan?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Seperti pura-pura makan, pura-pura telepon'
          },
          {
            nomorPertanyaan: 5,
            teksPertanyaan: 'Apakah anak sudah bisa menyusun 6 balok?',
            areaPerkembangan: 'Motorik Halus',
            instruksi: 'Menara balok minimal 6 tingkat'
          },
          {
            nomorPertanyaan: 6,
            teksPertanyaan: 'Apakah anak sudah bisa makan sendiri dengan sendok?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Makan tanpa banyak tumpah'
          },
          {
            nomorPertanyaan: 7,
            teksPertanyaan: 'Apakah anak sudah bisa melepas pakaiannya sendiri?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Minimal celana atau kaos'
          },
          {
            nomorPertanyaan: 8,
            teksPertanyaan: 'Apakah anak sudah bisa menunjuk gambar benda ketika disebutkan?',
            areaPerkembangan: 'Bicara dan Bahasa',
            instruksi: 'Minimal 5 gambar berbeda'
          },
          {
            nomorPertanyaan: 9,
            teksPertanyaan: 'Apakah anak sudah bisa berinteraksi dengan anak lain?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Bermain bersama atau berdampingan'
          },
          {
            nomorPertanyaan: 10,
            teksPertanyaan: 'Apakah anak sudah bisa menunjukkan perhatian pada gambar/cerita?',
            areaPerkembangan: 'Sosialisasi dan Kemandirian',
            instruksi: 'Duduk mendengarkan cerita'
          }
        ]
      }
    }
  });

  console.log('KPSP data seeded successfully!');
  console.log(`Created ${[category0_6, category6_12, category12_18, category18_24].length} categories`);
}

seedKPSP()
  .catch((e) => {
    console.error('Error seeding KPSP data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
