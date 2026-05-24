import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";

export async function POST(req) {

  try {

    const body = await req.json();

    const parsed =
      reservationSchema.parse(body);

    const idempotencyKey =
      req.headers.get(
        "Idempotency-Key"
      );

    // Check existing idempotent response
    if (idempotencyKey) {

      const existing =
        await prisma.idempotencyKey.findUnique({
          where: {
            key: idempotencyKey
          }
        });

      if (existing) {

        return Response.json(
          existing.response
        );
      }
    }

    const reservation =
      await prisma.$transaction(
        async (tx) => {

          const inventory =
            await tx.inventory.findUnique({
              where: {
                productId_warehouseId: {
                  productId:
                    parsed.productId,

                  warehouseId:
                    parsed.warehouseId
                }
              }
            });

          if (!inventory) {

            throw new Error(
              "Inventory not found"
            );
          }

          const availableStock =
            inventory.totalStock -
            inventory.reservedStock;

          if (
            availableStock <
            parsed.quantity
          ) {

            throw new Error(
              "INSUFFICIENT_STOCK"
            );
          }

          // Reserve stock
          await tx.inventory.update({
            where: {
              id: inventory.id
            },

            data: {
              reservedStock: {
                increment:
                  parsed.quantity
              }
            }
          });

          // Create reservation
          const createdReservation =
            await tx.reservation.create({
              data: {
                productId:
                  parsed.productId,

                warehouseId:
                  parsed.warehouseId,

                quantity:
                  parsed.quantity,

                expiresAt:
                  new Date(
                    Date.now() +
                    10 * 60 * 1000
                  )
              }
            });

          return createdReservation;
        }
      );

    // Store idempotent response
    if (idempotencyKey) {

      await prisma.idempotencyKey.create({
        data: {
          key: idempotencyKey,

          response: reservation
        }
      });
    }

    return Response.json(
      reservation
    );

  } catch (err) {

    console.error(err);

    if (
      err.message ===
      "INSUFFICIENT_STOCK"
    ) {

      return new Response(
        JSON.stringify({
          error:
            "Not enough stock"
        }),
        {
          status: 409
        }
      );
    }

    return new Response(
      JSON.stringify({
        error:
          err.message ||
          "Internal server error"
      }),
      {
        status: 500
      }
    );
  }
}