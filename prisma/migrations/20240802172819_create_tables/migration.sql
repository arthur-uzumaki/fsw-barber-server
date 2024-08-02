-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barder_shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phones" TEXT[],
    "deacription" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barder_shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barder_shop_service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "bardershopId" TEXT NOT NULL,

    CONSTRAINT "barder_shop_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booke" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booke_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "barder_shop_service" ADD CONSTRAINT "barder_shop_service_bardershopId_fkey" FOREIGN KEY ("bardershopId") REFERENCES "barder_shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booke" ADD CONSTRAINT "Booke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booke" ADD CONSTRAINT "Booke_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "barder_shop_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
