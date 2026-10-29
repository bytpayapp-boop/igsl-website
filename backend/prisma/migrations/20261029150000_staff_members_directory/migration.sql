-- CreateTable
CREATE TABLE IF NOT EXISTS "staff_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "facebook" TEXT,
    "profile_image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "staff_members_department_idx" ON "staff_members"("department");
CREATE INDEX IF NOT EXISTS "staff_members_created_at_idx" ON "staff_members"("created_at");
