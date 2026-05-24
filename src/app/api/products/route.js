export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const products =
      await prisma.product.findMany({
        include: {
          inventories: {
            include: {
              warehouse: true
            }
          }
        }
      });

    const formattedProducts =
      products.map((product) => ({

        id: product.id,
        name: product.name,

        inventories:
          product.inventories.map(
            (inventory) => ({

              warehouseId:
                inventory.warehouse.id,

              warehouseName:
                inventory.warehouse.name,

              totalStock:
                inventory.totalStock,

              reservedStock:
                inventory.reservedStock,

              availableStock:
                inventory.totalStock -
                inventory.reservedStock
            })
          )
      }));

    return Response.json(
      formattedProducts
    );

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          "Failed to fetch products"
      },
      {
        status: 500
      }
    );
  }
}