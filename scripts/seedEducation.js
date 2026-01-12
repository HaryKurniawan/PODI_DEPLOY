const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedEducation() {
    console.log('🌱 Seeding Education data...');

    // Create categories
    const categories = [
        { nama: 'Bayi & Balita', slug: 'bayi-balita', ikon: 'Baby', warna: 'blue', deskripsi: 'Informasi kesehatan bayi dan balita', urutan: 1 },
        { nama: 'Kesehatan Ibu', slug: 'kesehatan-ibu', ikon: 'Heart', warna: 'pink', deskripsi: 'Tips kesehatan ibu hamil dan menyusui', urutan: 2 },
        { nama: 'Gizi & Nutrisi', slug: 'gizi-nutrisi', ikon: 'Apple', warna: 'green', deskripsi: 'Panduan gizi seimbang', urutan: 3 },
        { nama: 'Tumbuh Kembang', slug: 'tumbuh-kembang', ikon: 'Activity', warna: 'orange', deskripsi: 'Stimulasi dan perkembangan anak', urutan: 4 },
        { nama: 'Imunisasi', slug: 'imunisasi', ikon: 'Syringe', warna: 'purple', deskripsi: 'Informasi vaksin dan imunisasi', urutan: 5 }
    ];

    console.log('📁 Creating categories...');
    const createdCategories = [];
    for (const cat of categories) {
        const created = await prisma.kategoriEdukasi.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat
        });
        createdCategories.push(created);
    }
    console.log(`✅ Created/updated ${createdCategories.length} categories`);

    // Create articles with images from Unsplash
    const articles = [
        // Bayi & Balita
        {
            categorySlug: 'bayi-balita',
            judul: 'Panduan Lengkap ASI Eksklusif 6 Bulan untuk Ibu Baru',
            slug: 'panduan-asi-eksklusif-6-bulan',
            thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
            ringkasan: 'Pelajari manfaat ASI eksklusif dan tips sukses menyusui selama 6 bulan pertama kehidupan bayi.',
            konten: `<h2>Mengapa ASI Eksklusif Penting?</h2>
<p>ASI eksklusif adalah pemberian ASI <strong>tanpa tambahan makanan atau minuman lain</strong> selama 6 bulan pertama kehidupan bayi.</p>`,
            tipe: 'ARTIKEL',
            durasi: '7 min',
            dipublikasikan: true
        },
        {
            categorySlug: 'bayi-balita',
            judul: 'Cara Mengatasi Demam pada Bayi dengan Aman',
            slug: 'mengatasi-demam-pada-bayi',
            thumbnail: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
            ringkasan: 'Panduan praktis menangani demam pada bayi di rumah dan kapan harus ke dokter.',
            konten: `<h2>🌡️ Memahami Demam pada Bayi</h2>
<p>Demam adalah respons alami tubuh terhadap infeksi.</p>`,
            tipe: 'ARTIKEL',
            durasi: '5 min',
            dipublikasikan: true
        },
        // Kesehatan Ibu
        {
            categorySlug: 'kesehatan-ibu',
            judul: 'Nutrisi Wajib untuk Ibu Hamil Trimester Pertama',
            slug: 'nutrisi-ibu-hamil-trimester-pertama',
            thumbnail: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80',
            ringkasan: 'Kenali nutrisi penting yang harus dipenuhi di 12 minggu pertama kehamilan.',
            konten: `<h2>🤰 Trimester Pertama: Masa Krusial</h2>
<p>Trimester pertama adalah periode pembentukan organ-organ vital janin.</p>`,
            tipe: 'ARTIKEL',
            durasi: '8 min',
            dipublikasikan: true
        },
        // Gizi & Nutrisi
        {
            categorySlug: 'gizi-nutrisi',
            judul: 'Panduan MPASI untuk Bayi 6-12 Bulan',
            slug: 'panduan-mpasi-bayi-6-12-bulan',
            thumbnail: 'https://images.unsplash.com/photo-1565515636369-57f6e9f5fe79?w=800&q=80',
            ringkasan: 'Cara memulai MPASI dengan benar, jadwal makan, dan resep sederhana untuk bayi.',
            konten: `<h2>🍽️ Memulai MPASI dengan Benar</h2>
<p>MPASI mulai diberikan saat bayi berusia 6 bulan.</p>`,
            tipe: 'ARTIKEL',
            durasi: '10 min',
            dipublikasikan: true
        },
        // Tumbuh Kembang
        {
            categorySlug: 'tumbuh-kembang',
            judul: 'Stimulasi Perkembangan Bayi 0-6 Bulan',
            slug: 'stimulasi-bayi-0-6-bulan',
            thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
            ringkasan: 'Aktivitas sederhana untuk merangsang perkembangan motorik, sensorik, dan kognitif bayi.',
            konten: `<h2>🧒 Pentingnya Stimulasi Dini</h2>
<p>1000 hari pertama adalah golden period perkembangan otak anak.</p>`,
            tipe: 'ARTIKEL',
            durasi: '8 min',
            dipublikasikan: true
        },
        // Imunisasi
        {
            categorySlug: 'imunisasi',
            judul: 'Jadwal Imunisasi Lengkap untuk Bayi 0-18 Bulan',
            slug: 'jadwal-imunisasi-bayi-lengkap',
            thumbnail: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
            ringkasan: 'Informasi lengkap jadwal imunisasi wajib dan tambahan sesuai rekomendasi IDAI.',
            konten: `<h2>💉 Pentingnya Imunisasi</h2>
<p>Imunisasi adalah cara paling efektif melindungi anak dari penyakit berbahaya.</p>`,
            tipe: 'ARTIKEL',
            durasi: '7 min',
            dipublikasikan: true
        }
    ];

    console.log('📝 Creating articles...');
    let articleCount = 0;
    for (const article of articles) {
        const category = createdCategories.find(c => c.slug === article.categorySlug);
        if (category) {
            await prisma.artikelEdukasi.upsert({
                where: { slug: article.slug },
                update: {
                    judul: article.judul,
                    konten: article.konten,
                    ringkasan: article.ringkasan,
                    thumbnail: article.thumbnail,
                    tipe: article.tipe,
                    durasi: article.durasi,
                    dipublikasikan: article.dipublikasikan,
                    dipublikasikanPada: article.dipublikasikan ? new Date() : null
                },
                create: {
                    kategoriId: category.id,
                    judul: article.judul,
                    slug: article.slug,
                    konten: article.konten,
                    ringkasan: article.ringkasan,
                    thumbnail: article.thumbnail,
                    tipe: article.tipe,
                    durasi: article.durasi,
                    dipublikasikan: article.dipublikasikan,
                    dipublikasikanPada: article.dipublikasikan ? new Date() : null
                }
            });
            articleCount++;
        }
    }
    console.log(`✅ Created/updated ${articleCount} articles`);

    console.log('\n🎉 Education data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${createdCategories.length} Categories`);
    console.log(`   - ${articleCount} Articles with images`);
}

seedEducation()
    .catch((e) => {
        console.error('❌ Error seeding education data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
