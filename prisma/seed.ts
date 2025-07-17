import { PrismaClient } from "@prisma/client";
import { hash } from "@/lib/crypto";

const prisma = new PrismaClient();

async function main() {
  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  // 2. Permissions
  const permissionNames = [
    "view_dashboard",
    "manage_products",
    "view_sales",
    "view_purchases",
  ];

  const permissions = await Promise.all(
    permissionNames.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // 3. Assign permissions to admin
  await Promise.all(
    permissions.map((perm) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      })
    )
  );

  // 4. Users
  const adminPassword = await hash("admin123");
  await hash("staff123"); // Optional: pre-hashing for staff user, even if not created

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      hashedPassword: adminPassword,
      roleId: adminRole.id,
    },
  });

  // 5. Categories
  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { name: "Clothing" },
    update: {},
    create: { name: "Clothing" },
  });

  // 6. Brands
  const apple = await prisma.brand.upsert({
    where: { name: "Apple" },
    update: {},
    create: { name: "Apple" },
  });

  const adidas = await prisma.brand.upsert({
    where: { name: "Adidas" },
    update: {},
    create: { name: "Adidas" },
  });

  // 7. Products
  const iphone = await prisma.product.upsert({
    where: { sku: "IPHONE13" },
    update: {},
    create: {
      name: "iPhone 13",
      sku: "IPHONE13",
      categoryId: electronics.id,
      brandId: apple.id,
      unitPrice: 1000,
      stock: 50,
    },
  });

  const tshirt = await prisma.product.upsert({
    where: { sku: "ADITEE" },
    update: {},
    create: {
      name: "Adidas T-Shirt",
      sku: "ADITEE",
      categoryId: clothing.id,
      brandId: adidas.id,
      unitPrice: 30,
      stock: 200,
    },
  });

  // 8. Customers
  const existingCustomer = await prisma.customer.findFirst({
    where: { email: "john@example.com" },
  });

  const customer =
    existingCustomer ??
    (await prisma.customer.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        address: "123 Street, City",
      },
    }));

  // 9. Suppliers
  const existingSupplier = await prisma.supplier.findFirst({
    where: { email: "supply@example.com" },
  });

  const supplier =
    existingSupplier ??
    (await prisma.supplier.create({
      data: {
        name: "Main Supplier",
        email: "supply@example.com",
        phone: "987654321",
        address: "456 Avenue, City",
      },
    }));

  // 10. Purchase
  await prisma.purchase.create({
    data: {
      supplierId: supplier.id,
      userId: adminUser.id,
      totalAmount: 5000,
      paidAmount: 3000,
      dueAmount: 2000,
      items: {
        create: [
          {
            productId: iphone.id,
            quantity: 5,
            unitPrice: 1000,
            totalPrice: 5000,
          },
        ],
      },
    },
  });

  // 11. Sale
  await prisma.sale.create({
    data: {
      customerId: customer.id,
      userId: adminUser.id,
      totalAmount: 60,
      paidAmount: 60,
      dueAmount: 0,
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 2,
            unitPrice: 30,
            totalPrice: 60,
          },
        ],
      },
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
