"use client";

import { useEffect, useState } from "react";
import { health } from "@/apis/health.api";

export default function Home() {
  const [checkHealth, setCheckHealth] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await health();
        setCheckHealth(res.data.status === "ok");
      } catch (error) {
        console.log(error);
      }
    };
    check();
  }, []);

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold">Trang chủ</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Trạng thái API:{" "}
        <span
          className={checkHealth ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}
        >
          {checkHealth ? "✓ Online" : "✗ Offline"}
        </span>
      </p>
    </div>
  );
}
