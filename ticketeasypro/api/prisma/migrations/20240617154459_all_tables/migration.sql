-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EVENT_MANAGER', 'STAFF', 'SPECTATOR');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'USED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "USERS" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "birth_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(256) NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "phone_fix" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SPECTATOR',
    "salt" TEXT NOT NULL,
    "token" TEXT,
    "token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VENUES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "address_type" VARCHAR(256) NOT NULL,
    "address" VARCHAR(512) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "zip_code" VARCHAR(10) NOT NULL,
    "city" VARCHAR(256) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "country" VARCHAR(512) NOT NULL DEFAULT 'BRASIL',
    "complements" VARCHAR(512) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "VENUES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDERS" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'PIX',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TICKETS" (
    "id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "TICKETS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDERTICKETS" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "ticketTypeId" INTEGER,

    CONSTRAINT "ORDERTICKETS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TICKETTYPES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "discount" SMALLINT NOT NULL DEFAULT 0,
    "description" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "TICKETTYPES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EVENTS" (
    "id" SERIAL NOT NULL,
    "manager_id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "initial_date" TIMESTAMP(0) NOT NULL,
    "final_date" TIMESTAMP(0) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PLANNED',
    "base_price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "img_banner" VARCHAR NOT NULL,
    "img_thumbnail" VARCHAR,
    "location_id" INTEGER NOT NULL,
    "color" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "EVENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CATEGORIES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_token_key" ON "USERS"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VENUES_name_key" ON "VENUES"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TICKETTYPES_name_key" ON "TICKETTYPES"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CATEGORIES_name_key" ON "CATEGORIES"("name");

-- AddForeignKey
ALTER TABLE "ORDERS" ADD CONSTRAINT "ORDERS_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "EVENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDERS" ADD CONSTRAINT "ORDERS_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKETS" ADD CONSTRAINT "TICKETS_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "EVENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "ORDERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TICKETTYPES"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "VENUES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
