export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function POST() {

  const expiredReservations =
    await prisma.reservation.findMany({
      where: {
        status: "PENDING",

        expiresAt: {
          lt: new Date()
        }
      }
    });

  for (const reservation of expiredReservations) {

    await prisma.$transaction(async (tx) => {

      await tx.inventory.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId
        },

        data: {
          reservedStock: {
            decrement: reservation.quantity
          }
        }
      });

      await tx.reservation.update({
        where: {
          id: reservation.id
        },

        data: {
          status: "RELEASED"
        }
      });
    });
  }

  return Response.json({
    cleaned:
      expiredReservations.length
  });
}