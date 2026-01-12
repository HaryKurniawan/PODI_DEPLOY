// File: scripts/seedUsers.js

const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

const usersData = [
    {
        nama: 'User Demo',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'PENGGUNA',
        emailTerverifikasi: true,
        sudahLengkapiProfil: false
    },
    {
        nama: 'Admin Demo',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'ADMIN',
        emailTerverifikasi: true,
        sudahLengkapiProfil: false
    }
];

async function seedUsers() {
    try {
        console.log('\n👤 Starting user seeding...\n');

        for (const userData of usersData) {
            // Check if user already exists
            const existingUser = await prisma.pengguna.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                console.log(`⏭ User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const user = await prisma.pengguna.create({
                data: {
                    nama: userData.nama,
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role,
                    emailTerverifikasi: userData.emailTerverifikasi,
                    sudahLengkapiProfil: userData.sudahLengkapiProfil
                }
            });

            console.log(`✔ Created ${userData.role}: ${user.email}`);
        }

        console.log('\n✨ User seeding DONE!\n');

    } catch (err) {
        console.error('❌ User seeding ERROR:', err);
        throw err;
    }
}

if (require.main === module) {
    seedUsers()
        .then(() => prisma.$disconnect())
        .catch((err) => {
            console.error(err);
            prisma.$disconnect();
            process.exit(1);
        });
}

module.exports = seedUsers;
