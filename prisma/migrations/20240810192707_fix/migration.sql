-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_owner_fkey";

-- AlterTable
ALTER TABLE "urls" ALTER COLUMN "user_owner" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_owner_fkey" FOREIGN KEY ("user_owner") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
