const prisma = require('../src/config/prisma');

async function main() {
    console.log('Seeding featured articles...');

    const articles = await prisma.artikelEdukasi.findMany({
        take: 3
    });

    if (articles.length === 0) {
        console.log('No articles found');
        return;
    }

    // Update first 2-3 to be featured
    for (const article of articles) {
        await prisma.artikelEdukasi.update({
            where: { id: article.id },
            data: { unggulan: true }
        });
        console.log(`Marked "${article.judul}" as featured`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
