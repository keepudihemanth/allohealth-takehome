export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {

  const { id } = await context.params;

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id
      },

      include: {
        product: true,
        warehouse: true
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

  return Response.json(reservation);
}