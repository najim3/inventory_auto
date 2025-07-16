import { PrismaClient } from "@prisma/client";
import { hash } from "../lib/crypto";

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const hashedPassword = await hash("admin123");

  await prisma.user.upsert({
    where: { email: "admin@ims.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ims.com",
      hashedPassword,
      roleId: role.id,
    },
  });

  console.log("✅ Admin user seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
