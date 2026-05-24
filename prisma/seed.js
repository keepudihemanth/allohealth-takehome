const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Warehouse A",
      location: "Hyderabad"
    }
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Warehouse B",
      location: "Bangalore"
    }
  });

  const product1 = await prisma.product.create({
    data: {
      name: "Gaming Mouse"
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Mechanical Keyboard"
    }
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalStock: 10
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalStock: 5
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalStock: 7
      }
    ]
  });

  console.log("Seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());