"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderApi } from "@/apis/order.api";
import { toast } from "react-toastify";
import {
  Search,
  ShoppingBag,
  Filter,
  ChevronRight,
  Loader2,
  Calendar,
  User,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCcw,
  CreditCard,
  Store,
  MapPin,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format.util";
import { handleApiError } from "@/utils/error.util";
import { Select } from "@/components/ui/Select";
import {
  NEXT_STATUS,
  NEXT_STATUS_LABEL,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
} from "@/constants/order";
import { useAuthStore } from "@/stores/auth.store";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const fetchOrders = async () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.warning("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    setLoading(true);
    try {
      const res = await orderApi.getAdminOrders({
        orderCode: searchTerm.startsWith("#")
          ? searchTerm.slice(1)
          : searchTerm,
        phone:
          !searchTerm.startsWith("#") && /^[0-9]+$/.test(searchTerm)
            ? searchTerm
            : undefined,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        fromDate,
        toDate,
        page,
        limit: 10,
      });
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      // Don't fetch if invalid
      return;
    }
    fetchOrders();
  }, [
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    fromDate,
    toDate,
    page,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (
      !confirm(
        `Bạn có chắc muốn chuyển trạng thái đơn hàng sang ${STATUS_LABELS[newStatus]}?`,
      )
    )
      return;

    setUpdating(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdating(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn hủy đơn hàng này? Thao tác này sẽ hoàn lại số lượng tồn kho.",
      )
    )
      return;

    setUpdating(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, "CANCELLED");
      toast.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-outfit pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <ShoppingBag className="w-6 h-6 text-slate-900" />
            Quản lý Đơn hàng - Chi nhánh {user?.shop?.name || "..."}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Theo dõi, xử lý và quản lý trạng thái đơn hàng của chi nhánh.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          title="Làm mới"
        >
          <RefreshCcw
            className={cn("w-5 h-5 text-slate-600", loading && "animate-spin")}
          />
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-100/50 border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <form
            onSubmit={handleSearch}
            className="md:col-span-2 relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn (#...) hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white text-sm transition-all font-medium"
            />
          </form>

          <Select
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            placeholder="Trạng thái đơn"
          />

          <Select
            value={paymentStatusFilter}
            onChange={(val) => {
              setPaymentStatusFilter(val);
              setPage(1);
            }}
            options={PAYMENT_STATUS_OPTIONS}
            placeholder="Thanh toán"
          />

          <Select
            value={paymentMethodFilter}
            onChange={(val) => {
              setPaymentMethodFilter(val);
              setPage(1);
            }}
            options={PAYMENT_METHOD_OPTIONS}
            placeholder="Phương thức"
          />

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                Từ
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white text-xs font-bold transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
                Đến
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white text-xs font-bold transition-all"
              />
            </div>
          </div>

          {(searchTerm ||
            statusFilter ||
            paymentStatusFilter ||
            paymentMethodFilter ||
            fromDate ||
            toDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPaymentStatusFilter("");
                setPaymentMethodFilter("");
                setFromDate("");
                setToDate("");
                setPage(1);
              }}
              className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-3 h-3" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && (!orders || orders.length === 0) ? (
          <div className="bg-white rounded-[32px] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 text-slate-300">
            <ShoppingBag className="w-16 h-16 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">
              Không có đơn hàng nào
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.orderCode}`}
                className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all overflow-hidden group block"
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        #{order.orderCode}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            STATUS_COLORS[order.status],
                          )}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>

                        {/* Handling Branch Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                          <Store className="w-3 h-3" />
                          {Array.from(
                            new Set(
                              order.items.map((item: any) => item.shopId?.name),
                            ),
                          )
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            Khách hàng
                          </span>
                          <span className="text-xs font-bold text-slate-700 truncate">
                            {order.shippingAddress.fullName}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400">
                            {order.shippingAddress.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            Thanh toán
                          </span>
                          <span className="text-[10px] font-bold text-slate-700">
                            {PAYMENT_METHOD_LABELS[order.paymentMethod] ||
                              order.paymentMethod}
                          </span>
                          <span
                            className={cn(
                              "text-[8px] font-black uppercase mt-0.5",
                              PAYMENT_STATUS_LABELS[order.paymentStatus] ===
                                "Đã thanh toán"
                                ? "text-emerald-500"
                                : "text-rose-500",
                            )}
                          >
                            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            Ngày đặt
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            Tổng tiền
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {formatPrice(order.finalTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex -space-x-3 items-center overflow-hidden py-1">
                    {order.items.slice(0, 4).map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm relative"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {idx === 3 && order.items.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-black text-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-50 pt-4 lg:pt-0 lg:pl-6">
                    {/* Next Status Action */}
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() =>
                          updateStatus(order.id, NEXT_STATUS[order.status]!)
                        }
                        disabled={!!updating}
                        className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                      >
                        {updating === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          NEXT_STATUS_LABEL[NEXT_STATUS[order.status]!]
                        )}
                      </button>
                    )}

                    {/* View Detail */}
                    {/* <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95">
                      <Eye className="w-5 h-5" />
                    </button> */}

                    {/* Cancel Action */}
                    {["PENDING", "CONFIRMED"].includes(order.status) && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={!!updating}
                        className="p-3 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-95 disabled:opacity-50"
                        title="Hủy đơn"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders && orders.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm",
                page === p
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-100 text-slate-600 hover:border-black hover:text-black",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
