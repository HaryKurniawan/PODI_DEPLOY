// Scheduler for sending notification reminders
// Run this as a cron job or scheduled task
const cron = require('node-cron');
const prisma = require('../config/prisma');
const { sendScheduleReminder, notifyUser } = require('../controllers/notificationController');

/**
 * Check for upcoming posyandu schedules and send reminders
 * Runs every minute to check for schedules 1 hour from now
 */
const checkUpcomingSchedules = async () => {
    try {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        const reminderWindowStart = new Date(oneHourFromNow.getTime() - 2 * 60 * 1000); // 2 min buffer
        const reminderWindowEnd = new Date(oneHourFromNow.getTime() + 2 * 60 * 1000);

        // Find registrations for schedules happening in ~1 hour
        const upcomingRegistrations = await prisma.pendaftaranPosyandu.findMany({
            where: {
                status: 'TERDAFTAR',
                pengingatTerkirim: false,
                jadwal: {
                    tanggalJadwal: {
                        gte: reminderWindowStart,
                        lte: reminderWindowEnd
                    }
                }
            },
            include: {
                jadwal: true,
                anak: true,
                pengguna: true
            }
        });

        if (upcomingRegistrations.length > 0) {
            console.log(`[Scheduler] Found ${upcomingRegistrations.length} registrations needing reminders`);

            for (const registration of upcomingRegistrations) {
                try {
                    // Create reminder data in frontend format
                    const reminderData = {
                        id: registration.id,
                        schedule: {
                            id: registration.jadwal.id,
                            scheduleDate: registration.jadwal.tanggalJadwal,
                            location: registration.jadwal.lokasi,
                            title: registration.jadwal.judul,
                            description: registration.jadwal.deskripsi
                        },
                        child: {
                            id: registration.anak.id,
                            fullName: registration.anak.namaLengkap
                        },
                        user: {
                            id: registration.pengguna.id,
                            name: registration.pengguna.nama,
                            email: registration.pengguna.email
                        }
                    };

                    await sendScheduleReminder(reminderData);

                    // Mark reminder as sent
                    await prisma.pendaftaranPosyandu.update({
                        where: { id: registration.id },
                        data: { pengingatTerkirim: true }
                    });

                    console.log(`[Scheduler] Reminder sent for registration ${registration.id}`);
                } catch (error) {
                    console.error(`[Scheduler] Error sending reminder for ${registration.id}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('[Scheduler] Error checking upcoming schedules:', error);
    }
};

/**
 * Check for upcoming immunizations and send reminders
 * Runs daily to check for immunizations due soon
 */
const checkUpcomingImmunizations = async () => {
    try {
        const today = new Date();
        const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Find children with pending immunizations
        const childrenWithPendingImmunizations = await prisma.dataAnak.findMany({
            where: {
                imunisasiList: {
                    some: {
                        status: 'MENUNGGU',
                        tanggalDijadwalkan: {
                            gte: today,
                            lte: threeDaysFromNow
                        },
                        pengingatTerkirim: false
                    }
                }
            },
            include: {
                pengguna: true,
                imunisasiList: {
                    where: {
                        status: 'MENUNGGU',
                        tanggalDijadwalkan: {
                            gte: today,
                            lte: threeDaysFromNow
                        },
                        pengingatTerkirim: false
                    },
                    include: {
                        vaksin: true
                    }
                }
            }
        });

        if (childrenWithPendingImmunizations.length > 0) {
            console.log(`[Scheduler] Found ${childrenWithPendingImmunizations.length} children with upcoming immunizations`);

            for (const child of childrenWithPendingImmunizations) {
                for (const immunization of child.imunisasiList) {
                    try {
                        const scheduledDate = new Date(immunization.tanggalDijadwalkan).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        });

                        await notifyUser(
                            child.penggunaId,
                            '💉 Pengingat Imunisasi',
                            `Imunisasi ${immunization.vaksin?.nama || 'vaksin'} untuk ${child.namaLengkap} dijadwalkan ${scheduledDate}`,
                            {
                                type: 'IMMUNIZATION_REMINDER',
                                childId: child.id,
                                immunizationId: immunization.id,
                                url: '/imunisasi'
                            }
                        );

                        // Mark reminder as sent
                        await prisma.imunisasiAnak.update({
                            where: { id: immunization.id },
                            data: { pengingatTerkirim: true }
                        });

                        console.log(`[Scheduler] Immunization reminder sent for ${child.namaLengkap}`);
                    } catch (error) {
                        console.error(`[Scheduler] Error sending immunization reminder:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('[Scheduler] Error checking upcoming immunizations:', error);
    }
};

/**
 * Initialize scheduler
 */
const initScheduler = () => {
    // Check for upcoming posyandu schedules every minute
    cron.schedule('* * * * *', checkUpcomingSchedules);

    // Check for upcoming immunizations daily at 9 AM
    cron.schedule('0 9 * * *', checkUpcomingImmunizations);

    console.log('✅ Notification scheduler initialized');
};

module.exports = {
    initScheduler,
    checkUpcomingSchedules,
    checkUpcomingImmunizations
};
