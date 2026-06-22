-- CreateTable
CREATE TABLE "Currency" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "value" DECIMAL(10,4) NOT NULL,

  CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "passwordText" TEXT,
  "token" TEXT,
  "role" INTEGER NOT NULL DEFAULT 0,
  "emailVerify" TIMESTAMP(3),
  "username" TEXT,
  "name" TEXT,
  "birthdate" TIMESTAMP(3),
  "passwordHash" TEXT,
  "parentId" TEXT,
  "currencyId" TEXT,
  "clientShare" INTEGER NOT NULL DEFAULT 0,
  "casino" TEXT[],
  "creditReference" INTEGER NOT NULL DEFAULT 0,
  "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "systemIp" TEXT,
  "browserIp" TEXT,
  "status" TEXT NOT NULL DEFAULT '1',
  "betAllow" BOOLEAN NOT NULL DEFAULT true,
  "exposure" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "gapCasinoToken" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "systemIp" TEXT,
  "browserIp" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT,

  CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

-- CreateIndex
CREATE INDEX "Currency_code_idx" ON "Currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_parentId_idx" ON "User"("parentId");

-- CreateIndex
CREATE INDEX "User_currencyId_idx" ON "User"("currencyId");

-- CreateIndex
CREATE INDEX "LoginHistory_email_idx" ON "LoginHistory"("email");

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
