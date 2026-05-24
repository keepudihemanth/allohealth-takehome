export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const products = await prisma.product.findMany({
    include: {
      inventories: {
        include: {
          warehouse: true
        }
      }
    }
  });

  const formatted = products.map((product) => ({
    id: product.id,
    name: product.name,

    inventories: product.inventories.map((inv) => ({
      warehouseId: inv.warehouseId,
      warehouseName: inv.warehouse.name,

      totalStock: inv.totalStock,

      reservedStock: inv.reservedStock,

      availableStock:
        inv.totalStock - inv.reservedStock
    }))
  }));

  return Response.json(formatted);
}