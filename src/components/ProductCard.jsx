"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {

  const router = useRouter();

  async function reserve(warehouseId) {

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product.id,
        warehouseId,
        quantity: 1
      })
    });

    if (res.status === 409) {
      alert("Not enough stock");
      return;
    }

    const data = await res.json();

    router.push(`/reservation/${data.id}`);
  }

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold">
        {product.name}
      </h2>

      {product.inventories.map((inv) => (
        <div
          key={inv.warehouseId}
          className="flex justify-between mt-2"
        >
          <span>
            {inv.warehouseName} - Available:
            {" "}
            {inv.available}
          </span>

          <button
            onClick={() => reserve(inv.warehouseId)}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Reserve
          </button>
        </div>
      ))}
    </div>
  );
}