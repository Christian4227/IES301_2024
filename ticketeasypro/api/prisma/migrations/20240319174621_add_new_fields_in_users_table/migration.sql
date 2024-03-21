-- CreateTable
CREATE TABLE "USERS" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "birth_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "phone_fix" TEXT,
    "type" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");
