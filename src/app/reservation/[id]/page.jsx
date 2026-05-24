"use client";

import { useEffect, useState } from "react";
import Countdown from "@/components/Countdown";

export default function ReservationPage(props) {

  const [reservationId, setReservationId] =
    useState(null);

  const [reservation, setReservation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadParams() {

      const resolvedParams =
        await props.params;

      setReservationId(
        resolvedParams.id
      );
    }

    loadParams();

  }, [props.params]);

  useEffect(() => {

    if (!reservationId) return;

    async function fetchReservation() {

      try {

        const res = await fetch(
          `/api/reservations/${reservationId}`
        );

        const data = await res.json();

        if (!res.ok) {

          setError(
            data.error ||
            "Failed to fetch reservation"
          );

          return;
        }

        setReservation(data);

      } catch (err) {

        console.error(err);

        setError("Something went wrong");

      } finally {

        setLoading(false);
      }
    }

    fetchReservation();

  }, [reservationId]);

  async function confirmPurchase() {

    const res = await fetch(
      `/api/reservations/${reservationId}/confirm`,
      {
        method: "POST"
      }
    );

    if (res.status === 410) {

      alert("Reservation expired");

      return;
    }

    if (!res.ok) {

      alert("Failed to confirm");

      return;
    }

    alert("Purchase confirmed");

    window.location.href = "/";
  }

  async function cancelReservation() {

    const res = await fetch(
      `/api/reservations/${reservationId}/release`,
      {
        method: "POST"
      }
    );

    if (!res.ok) {

      alert("Failed to cancel");

      return;
    }

    alert("Reservation cancelled");

    window.location.href = "/";
  }

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-slate-300">
        Loading reservation...
      </div>
    );
  }

  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">

        <div className="flex items-center justify-between mb-8">

          <div>
            <div className="text-slate-400 text-sm mb-2">
              Reservation Checkout
            </div>

            <h1 className="text-4xl font-bold">
              Confirm Purchase
            </h1>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl font-bold">
            {reservation.product.name.charAt(0)}
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">

          <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
            <div className="text-slate-400 text-sm mb-2">
              Product
            </div>
            <div className="text-xl font-semibold">
              {reservation.product.name}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
            <div className="text-slate-400 text-sm mb-2">
              Warehouse
            </div>
            <div className="text-xl font-semibold">
              {reservation.warehouse.name}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
            <div className="text-slate-400 text-sm mb-2">
              Quantity
            </div>
            <div className="text-xl font-semibold">
              {reservation.quantity}
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 border border-white/10 p-5">
            <div className="text-slate-400 text-sm mb-2">
              Status
            </div>
            <div className="text-xl font-semibold text-emerald-400">
              {reservation.status}
            </div>
          </div>

        </div>

        <div className="mb-8">
          <Countdown
            expiresAt={reservation.expiresAt}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <button
            onClick={confirmPurchase}
            className="
              flex-1
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-emerald-500
              to-green-600
              font-semibold
              text-lg
            "
          >
            Confirm Purchase
          </button>

          <button
            onClick={cancelReservation}
            className="
              flex-1
              py-4
              rounded-2xl
              bg-white/10
              border
              border-white/10
              font-semibold
              text-lg
              hover:bg-white/20
            "
          >
            Cancel Reservation
          </button>

        </div>

      </div>

    </div>
  );
}