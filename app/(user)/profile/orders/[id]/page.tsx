"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orderApi } from "@/apis/order.api";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/utils/format.util";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import { STATUS_DISPLAY } from "@/constants/order";

const STATUS_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  SHIPPING: Truck,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrder(id as string);
        setOrder(res.data);
      } catch (error) {
        toast.error("Không thể tải thông tin đơn hàng");
        router.push("/profile/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
          Đang tải chi tiết...
        </p>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = STATUS_DISPLAY[order.status] || STATUS_DISPLAY.PENDING;
  const StatusIcon =
    STATUS_ICONS[order.status as keyof typeof STATUS_ICONS] || Clock;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-stone-50 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">
              Chi tiết đơn hàng
            </h2>
            <p className="text-sm text-stone-400 font-medium mt-1">
              Mã đơn:{" "}
              <span className="text-black font-bold uppercase">
                {order.orderCode}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-stone-100 rounded-[32px] overflow-hidden">
              <div className="p-6 border-b border-stone-50 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-4 h-4" /> Sản phẩm ({order.items.length}
                  )
                </h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    statusConfig.bg,
                    statusConfig.color,
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
              <div className="divide-y divide-stone-50">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 flex gap-6 group hover:bg-stone-50 transition-colors"
                  >
                    <div className="w-20 h-24 rounded-2xl bg-stone-100 overflow-hidden shadow-sm flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-black uppercase tracking-tight truncate leading-none">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2">
                        Màu: {item.color} • Size: {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs font-medium text-stone-500">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                        <p className="text-sm font-black text-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-stone-50/30 space-y-3">
                <div className="flex justify-between text-xs font-medium text-stone-500">
                  <span>Tạm tính</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-stone-500">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between">
                  <span className="text-sm font-black uppercase tracking-widest">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-black text-black">
                    {formatPrice(order.finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Placeholder */}
            <div className="bg-white border border-stone-100 rounded-[32px] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Lịch sử đơn hàng
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 relative">
                  <div className="absolute top-8 left-[11px] bottom-0 w-0.5 bg-stone-100" />
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center relative z-10">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-black uppercase tracking-tight">
                      Đặt hàng thành công
                    </p>
                    <p className="text-[10px] text-stone-400 font-bold mt-1 uppercase">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                {order.status !== "PENDING" && (
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-black uppercase tracking-tight">
                        Đơn hàng đã được xác nhận
                      </p>
                      <p className="text-[10px] text-stone-400 font-bold mt-1 uppercase">
                        Hệ thống đã xác nhận đơn hàng
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white border border-stone-100 rounded-[32px] p-8 space-y-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-black text-black uppercase tracking-tight">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  {order.shippingAddress.phone}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.ward}, {order.shippingAddress.district}
                  , {order.shippingAddress.province}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-stone-100 rounded-[32px] p-8 space-y-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Phương thức thanh toán
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-black text-black uppercase tracking-tight">
                  {order.paymentMethod === "COD"
                    ? "Thanh toán khi nhận hàng"
                    : order.paymentMethod}
                </p>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600",
                  )}
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="bg-stone-50 rounded-[32px] p-8 space-y-4">
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Truck className="w-3.5 h-3.5" /> Giao hàng bởi
              </p>
              <p className="text-sm font-black text-black uppercase tracking-tight">
                DaoDuck Express
              </p>
              <p className="text-[10px] text-stone-400 font-medium leading-relaxed italic">
                * Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy khu vực.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
