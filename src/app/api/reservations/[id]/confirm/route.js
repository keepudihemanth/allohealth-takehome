import { prisma } from "@/lib/prisma";

export async function POST(req, context) {

  console.log("CONFIRM API HIT");

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

  if (new Date() > reservation.expiresAt) {
    return new Response(
      JSON.stringify({
        error: "Reservation expired"
      }),
      {
        status: 410
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

        totalStock: {
          decrement: reservation.quantity
        },

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
        status: "CONFIRMED"
      }
    });
  });

  return Response.json({
    success: true
  });
}