-- CreateEnum
CREATE TYPE "KPSPResult" AS ENUM ('SESUAI', 'MERAGUKAN', 'PENYIMPANGAN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('PENDING', 'COMPLETED', 'MISSED', 'POSTPONED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "hasCompletedProfile" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mother_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "education" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "jkn" TEXT NOT NULL,
    "facilityTK1" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mother_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spouse_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spouse_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "birthCertificate" TEXT NOT NULL,
    "childOrder" INTEGER NOT NULL,
    "bloodType" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "children_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu_schedules" (
    "id" TEXT NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posyandu_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posyandu_registrations" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posyandu_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_examinations" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "examinationDate" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "headCircumference" DOUBLE PRECISION NOT NULL,
    "armCircumference" DOUBLE PRECISION NOT NULL,
    "immunization" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immunization_templates" (
    "id" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "ageInMonths" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "immunization_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immunization_vaccines" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendedAge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "immunization_vaccines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_immunizations" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "vaccineId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "vaccinationDate" TIMESTAMP(3) NOT NULL,
    "status" "VaccinationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "administeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_immunizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpsp_age_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAgeMonths" INTEGER NOT NULL,
    "maxAgeMonths" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpsp_age_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpsp_questions" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "developmentArea" TEXT NOT NULL,
    "instruction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpsp_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpsp_screenings" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "screeningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ageAtScreening" INTEGER NOT NULL,
    "totalYes" INTEGER NOT NULL,
    "totalNo" INTEGER NOT NULL,
    "result" "KPSPResult" NOT NULL,
    "notes" TEXT,
    "recommendedAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpsp_screenings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpsp_answers" (
    "id" TEXT NOT NULL,
    "screeningId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpsp_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mother_data_userId_key" ON "mother_data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "spouse_data_userId_key" ON "spouse_data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "children_data_nik_key" ON "children_data"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "posyandu_registrations_scheduleId_childId_key" ON "posyandu_registrations"("scheduleId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "child_immunizations_childId_vaccineId_vaccinationDate_key" ON "child_immunizations"("childId", "vaccineId", "vaccinationDate");

-- CreateIndex
CREATE UNIQUE INDEX "kpsp_age_categories_code_key" ON "kpsp_age_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "kpsp_questions_categoryId_questionNumber_key" ON "kpsp_questions"("categoryId", "questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "kpsp_answers_screeningId_questionId_key" ON "kpsp_answers"("screeningId", "questionId");

-- AddForeignKey
ALTER TABLE "mother_data" ADD CONSTRAINT "mother_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_data" ADD CONSTRAINT "spouse_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children_data" ADD CONSTRAINT "children_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_registrations" ADD CONSTRAINT "posyandu_registrations_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "posyandu_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_registrations" ADD CONSTRAINT "posyandu_registrations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posyandu_registrations" ADD CONSTRAINT "posyandu_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_examinations" ADD CONSTRAINT "child_examinations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_examinations" ADD CONSTRAINT "child_examinations_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "posyandu_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immunization_vaccines" ADD CONSTRAINT "immunization_vaccines_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "immunization_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_immunizations" ADD CONSTRAINT "child_immunizations_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_immunizations" ADD CONSTRAINT "child_immunizations_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "immunization_vaccines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_immunizations" ADD CONSTRAINT "child_immunizations_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "posyandu_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpsp_questions" ADD CONSTRAINT "kpsp_questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "kpsp_age_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpsp_screenings" ADD CONSTRAINT "kpsp_screenings_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpsp_screenings" ADD CONSTRAINT "kpsp_screenings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "kpsp_age_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpsp_answers" ADD CONSTRAINT "kpsp_answers_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "kpsp_screenings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpsp_answers" ADD CONSTRAINT "kpsp_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "kpsp_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
