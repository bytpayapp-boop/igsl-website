-- CreateEnum
CREATE TYPE "SiteContentType" AS ENUM ('NEWS', 'INFO', 'GALLERY');

-- AlterTable
ALTER TABLE "uploaded_documents" ADD COLUMN IF NOT EXISTS "imagekit_file_id" TEXT;
ALTER TABLE "uploaded_documents" ADD COLUMN IF NOT EXISTS "storage_folder" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "site_content_uploads" (
    "id" TEXT NOT NULL,
    "type" "SiteContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT,
    "description" TEXT,
    "author" TEXT,
    "tags" TEXT,
    "cover_image_url" TEXT,
    "gallery_images" JSONB,
    "admin_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_content_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "site_content_uploads_type_idx" ON "site_content_uploads"("type");
CREATE INDEX IF NOT EXISTS "site_content_uploads_category_idx" ON "site_content_uploads"("category");
CREATE INDEX IF NOT EXISTS "site_content_uploads_created_at_idx" ON "site_content_uploads"("created_at");
