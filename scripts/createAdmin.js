const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await prisma.pengguna.upsert({
            where: { email: 'admin@gmail.com' },
            update: {
                password: hashedPassword,
                role: 'ADMIN'
            },
            create: {
                email: 'admin@gmail.com',
                nama: 'Admin',
                password: hashedPassword,
                role: 'ADMIN',
                emailTerverifikasi: true,
                sudahLengkapiProfil: true
            }
        });

        console.log('✅ Admin account created successfully!');
        console.log('Email:', admin.email);
        console.log('Role:', admin.role);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
