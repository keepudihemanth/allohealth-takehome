import { prisma } from "@/lib/prisma";

export async function GET() {
  const warehouses = await prisma.warehouse.findMany();

  return Response.json(warehouses);
}