/*
  Warnings:

  - You are about to drop the column `api_key` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `api_requests_today` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at_pt_br` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date_last_api_request` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token_expires_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_charge_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_ends_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_hosted_invoice_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_receipt_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_starts_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_updated_at_pt_br` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at_pt_br` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_billing_portal_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_charges_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_checkouts_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_customers_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_invoices_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stripe_webhook_payments_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_api_key_key";

-- DropIndex
DROP INDEX "users_email_reset_password_token_key";

-- DropIndex
DROP INDEX "users_reset_password_token_key";

-- DropIndex
DROP INDEX "users_stripe_customer_id_key";

-- DropIndex
DROP INDEX "users_stripe_subscription_charge_id_key";

-- DropIndex
DROP INDEX "users_stripe_subscription_hosted_invoice_url_key";

-- DropIndex
DROP INDEX "users_stripe_subscription_receipt_url_key";

-- DropIndex
DROP INDEX "users_telegram_number_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "api_key",
DROP COLUMN "api_requests_today",
DROP COLUMN "created_at_pt_br",
DROP COLUMN "date_last_api_request",
DROP COLUMN "reset_password_token",
DROP COLUMN "reset_password_token_expires_at",
DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_subscription_active",
DROP COLUMN "stripe_subscription_charge_id",
DROP COLUMN "stripe_subscription_ends_at",
DROP COLUMN "stripe_subscription_hosted_invoice_url",
DROP COLUMN "stripe_subscription_name",
DROP COLUMN "stripe_subscription_receipt_url",
DROP COLUMN "stripe_subscription_starts_at",
DROP COLUMN "stripe_updated_at",
DROP COLUMN "stripe_updated_at_pt_br",
DROP COLUMN "telegram_number",
DROP COLUMN "updated_at_pt_br",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "games";

-- DropTable
DROP TABLE "stripe_webhook_billing_portal_logs";

-- DropTable
DROP TABLE "stripe_webhook_charges_logs";

-- DropTable
DROP TABLE "stripe_webhook_checkouts_logs";

-- DropTable
DROP TABLE "stripe_webhook_customers_logs";

-- DropTable
DROP TABLE "stripe_webhook_invoices_logs";

-- DropTable
DROP TABLE "stripe_webhook_payments_logs";

-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_original_key" ON "urls"("original");

-- CreateIndex
CREATE UNIQUE INDEX "urls_code_key" ON "urls"("code");
