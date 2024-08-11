/*
  Warnings:

  - You are about to drop the column `user_owner` on the `urls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_owner_fkey";

-- AlterTable
ALTER TABLE "urls" DROP COLUMN "user_owner",
ADD COLUMN     "user_owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_owner_id_fkey" FOREIGN KEY ("user_owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
