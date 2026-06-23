import bcrypt from "bcrypt";

import { connectDb, disconnectDb, prisma } from "@sportbooks/db";

const currencies = [
  { name: "British Pound Sterling", code: "GBP", value: 1 },
  { name: "United States Dollar", code: "USD", value: 1 },
  { name: "Euro", code: "EUR", value: 1 },
  { name: "Indian Rupee", code: "INR", value: 1 },
  { name: "United Arab Emirates Dirham", code: "AED", value: 1 },
];

const adminUsername = process.env.SEED_ADMIN_USERNAME?.trim();
const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

if (!adminUsername || !adminEmail || !adminPassword) {
  throw new Error(
    "SEED_ADMIN_USERNAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD are required.",
  );
}

async function seed() {
  await connectDb();

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { name: currency.name },
      create: currency,
      update: {
        code: currency.code,
        value: currency.value,
      },
    });
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        username: adminUsername,
        name: "Platform Administrator",
        role: 1,
        status: "1",
        emailVerify: existingAdmin.emailVerify ?? new Date(),
      },
    });

    console.log("Existing admin updated. Password was not changed.");
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        name: "Platform Administrator",
        password: passwordHash,
        role: 1,
        status: "1",
        emailVerify: new Date(),
      },
    });

    console.log("Admin account created.");
  }

  console.log("Currencies seeded: " + currencies.map((currency) => currency.code).join(", "));
}

seed()
  .catch((error) => {
    console.error("Staging seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });