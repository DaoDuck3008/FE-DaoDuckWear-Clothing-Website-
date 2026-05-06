"use client";

import { Heart } from "lucide-react";

export default function FavoritesProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">
          Sản phẩm yêu thích
        </h2>
        <p className="text-sm text-stone-400 font-medium mt-1">
          Danh sách các sản phẩm bạn đã lưu để xem sau.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
          <Heart className="w-8 h-8 text-rose-200" />
        </div>
        <h3 className="text-base font-black text-black uppercase tracking-tight">
          Danh sách trống
        </h3>
        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-2">
          Lưu những món đồ bạn yêu thích ngay nào!
        </p>
      </div>
    </div>
  );
}
