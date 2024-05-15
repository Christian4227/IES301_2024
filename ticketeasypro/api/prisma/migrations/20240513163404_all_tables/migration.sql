-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymenMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EVENT_MANAGER', 'STAFF', 'SPECTATOR');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "USERS" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "birth_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(256) NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_fix" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SPECTATOR',
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VENUES" (
    "id" SERIAL NOT NULL,
    "address_type" VARCHAR(256) NOT NULL,
    "address" VARCHAR(512) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "zip_code" VARCHAR(10) NOT NULL,
    "city" VARCHAR(256) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "country" VARCHAR(512) NOT NULL DEFAULT 'BRASIL',
    "complements" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "VENUES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDERITEMS" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "ORDERITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ORDERS" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "total_amount" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    "payment_method" "PaymenMethod" NOT NULL DEFAULT 'PIX',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TICKETS" (
    "id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'AVAILABLE',
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "TICKETS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TYPETICKETS" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "discount" SMALLINT NOT NULL DEFAULT 0,
    "description" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "TYPETICKETS_pkey" PRIMARY KEY ("id")
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
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "EVENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CATEGORIES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TYPETICKETS_name_key" ON "TYPETICKETS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CATEGORIES_name_key" ON "CATEGORIES"("name");

-- AddForeignKey
ALTER TABLE "ORDERS" ADD CONSTRAINT "ORDERS_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKETS" ADD CONSTRAINT "TICKETS_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "TYPETICKETS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKETS" ADD CONSTRAINT "TICKETS_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "EVENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENTS" ADD CONSTRAINT "EVENTS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "VENUES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
