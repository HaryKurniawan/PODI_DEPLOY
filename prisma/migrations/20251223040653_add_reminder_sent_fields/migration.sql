-- AlterTable
ALTER TABLE "child_immunizations" ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posyandu_registrations" ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false;
