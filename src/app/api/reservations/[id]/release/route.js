export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function POST(req, context) {

  const { id } = await context.params;

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id
      }
    });

  if (!reservation) {
    return new Response(
      JSON.stringify({
        error: "Reservation not found"
      }),
      {
        status: 404
      }
    );
  }

  if (reservation.status !== "PENDING") {
    return new Response(
      JSON.stringify({
        error: "Reservation already processed"
      }),
      {
        status: 400
      }
    );
  }

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
        id
      },

      data: {
        status: "RELEASED"
      }
    });
  });

  return Response.json({
    success: true
  });
}