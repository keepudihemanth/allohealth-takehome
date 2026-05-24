"use client";

import { useEffect, useState } from "react";

export default function Countdown({
  expiresAt
}) {

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {

    const interval = setInterval(() => {

      const diff =
        new Date(expiresAt) - new Date();

      if (diff <= 0) {

        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes =
        Math.floor(diff / 60000);

      const seconds =
        Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );

    }, 1000);

    return () => clearInterval(interval);

  }, [expiresAt]);

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">

      <div className="text-sm text-orange-300 mb-1">
        Reservation Timer
      </div>

      <div className="text-2xl font-bold text-orange-400">
        {timeLeft}
      </div>

    </div>
  );
}