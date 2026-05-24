"use client";

import { useEffect, useState } from "react";

export default function HomePage() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function fetchProducts() {

    try {

      await fetch(
        "/api/cleanup-expired",
        {
          method: "POST"
        }
      );

      const res =
        await fetch("/api/products");

      const data = await res.json();

      setProducts(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  async function reserveProduct(
    productId,
    warehouseId
  ) {

    try {

      const res = await fetch(
        "/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            productId,
            warehouseId,
            quantity: 1
          })
        }
      );

      const data = await res.json();

      if (res.status === 409) {

        alert("Not enough stock");

        return;
      }

      if (!res.ok) {

        alert(
          data.error ||
          "Reservation failed"
        );

        return;
      }

      window.location.href =
        `/reservation/${data.id}`;

    } catch (err) {

      console.error(err);

      alert("Something went wrong");
    }
  }

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-slate-300">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-12">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-300 mb-4 backdrop-blur-md">
          Multi Warehouse Inventory Platform
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Inventory Reservation
          <span className="text-blue-400">
            {" "}
            System
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          Prevent overselling with temporary stock reservations,
          live inventory visibility, and checkout-safe concurrency.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {products.map((product) => (

          <div
            key={product.id}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl hover:border-blue-500/40 transition-all duration-300"
          >

            <div className="flex items-start justify-between mb-6">

              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {product.name}
                </h2>

                <p className="text-slate-400 text-sm">
                  Real-time warehouse stock tracking
                </p>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                {product.name.charAt(0)}
              </div>

            </div>

            <div className="space-y-4">

              {product.inventories.map((inv) => (

                <div
                  key={inv.warehouseId}
                  className="rounded-2xl bg-black/20 border border-white/10 p-4"
                >

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <div className="font-medium text-lg">
                        {inv.warehouseName}
                      </div>

                      <div className="text-slate-400 text-sm">
                        Fulfillment warehouse
                      </div>

                    </div>

                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                      {inv.availableStock} Available
                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">

                    <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                      <div className="text-slate-400 text-xs mb-1">
                        Total
                      </div>
                      <div className="font-semibold text-lg">
                        {inv.totalStock}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                      <div className="text-slate-400 text-xs mb-1">
                        Reserved
                      </div>
                      <div className="font-semibold text-lg text-orange-400">
                        {inv.reservedStock}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                      <div className="text-slate-400 text-xs mb-1">
                        Available
                      </div>
                      <div className="font-semibold text-lg text-emerald-400">
                        {inv.availableStock}
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      reserveProduct(
                        product.id,
                        inv.warehouseId
                      )
                    }

                    disabled={
                      inv.availableStock <= 0
                    }

                    className="
                      w-full
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-600
                      hover:from-blue-400
                      hover:to-indigo-500
                      font-semibold
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    Reserve Inventory
                  </button>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}