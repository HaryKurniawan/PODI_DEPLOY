-- CreateEnum
CREATE TYPE "DataChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DataChangeType" AS ENUM ('MOTHER', 'SPOUSE', 'CHILD');

-- AlterTable
ALTER TABLE "children_data" ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'L';

-- CreateTable
CREATE TABLE "data_change_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "DataChangeType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "oldData" JSONB NOT NULL,
    "newData" JSONB NOT NULL,
    "changedFields" TEXT[],
    "status" "DataChangeStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_change_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "data_change_requests" ADD CONSTRAINT "data_change_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
