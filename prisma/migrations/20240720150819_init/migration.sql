-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numNights" INTEGER,
    "numGuests" INTEGER,
    "cabinPrice" DOUBLE PRECISION,
    "extrasPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "hasBreakfast" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "cabinId" UUID NOT NULL,
    "guestId" UUID NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cabin" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "regularPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Cabin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nationality" TEXT,
    "nationalId" TEXT,
    "countryFlag" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minBookingLength" INTEGER NOT NULL DEFAULT 7,
    "maxBookingLength" INTEGER NOT NULL DEFAULT 30,
    "maxGuestsPerBooking" INTEGER NOT NULL DEFAULT 10,
    "breakfastPrice" DOUBLE PRECISION NOT NULL DEFAULT 10.0,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_cabinId_idx" ON "Booking"("cabinId");

-- CreateIndex
CREATE INDEX "Booking_guestId_idx" ON "Booking"("guestId");

-- CreateIndex
CREATE INDEX "Cabin_name_idx" ON "Cabin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE INDEX "Setting_id_idx" ON "Setting"("id");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_cabinId_fkey" FOREIGN KEY ("cabinId") REFERENCES "Cabin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
