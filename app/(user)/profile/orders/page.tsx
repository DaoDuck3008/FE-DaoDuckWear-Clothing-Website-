"use client";

import { useEffect, useState, useCallback } from "react";
import { orderApi } from "@/apis/order.api";
import { OrderCard } from "@/components/order/OrderCard";
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  Calendar as CalendarIcon,
  Filter,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/constants/order";
import { Select } from "@/components/ui/Select";

const STATUS_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  SHIPPING: Truck,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function OrdersProfilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.getMyOrders({
        orderCode: searchTerm,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
        fromDate,
        toDate,
        page,
        limit,
      });
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    statusFilter,
    paymentStatusFilter,
    fromDate,
    toDate,
    page,
    limit,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    setCancellingId(orderId);
    try {
      await orderApi.cancelMyOrder(orderId);
      toast.success("Hủy đơn hàng thành công");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Hủy đơn hàng thất bại");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-black uppercase tracking-tight">
              Đơn hàng của tôi
            </h2>
            <p className="text-sm text-stone-400 font-medium mt-1">
              Bạn có tổng cộng{" "}
              <span className="text-black font-bold">{totalItems}</span> đơn
              hàng đã thực hiện.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-stone-100 rounded-[32px] p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-black" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                Bộ lọc nâng cao
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-black transition-all active:scale-95 group"
            >
              <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              Đặt lại
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Tìm kiếm mã đơn
              </label>
              <div className="flex items-center gap-3 bg-stone-50 px-4 h-11 rounded-xl border border-stone-100 focus-within:border-black focus-within:bg-white transition-all group">
                <Search className="w-4 h-4 text-stone-300 group-focus-within:text-black transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Mã đơn hàng..."
                  className="bg-transparent border-none p-0 text-[11px] focus:outline-none font-bold uppercase tracking-widest focus:ring-0 w-full placeholder:text-stone-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Trạng thái đơn hàng
              </label>
              <Select
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
                options={[
                  { label: "Tất cả trạng thái", value: "" },
                  ...STATUS_OPTIONS,
                ]}
                className="w-full h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Thanh toán
              </label>
              <Select
                value={paymentStatusFilter}
                onChange={(val) => {
                  setPaymentStatusFilter(val);
                  setPage(1);
                }}
                options={[
                  { label: "Tất cả trạng thái", value: "" },
                  ...PAYMENT_STATUS_OPTIONS,
                ]}
                className="w-full h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Từ ngày
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 bg-stone-50 border-stone-100 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:ring-0 px-4 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 bg-stone-50 border-stone-100 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:border-black focus:bg-white focus:ring-0 px-4 transition-all"
              />
            </div>
          </div>

          {(statusFilter ||
            paymentStatusFilter ||
            fromDate ||
            toDate ||
            searchTerm) && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Content List */}
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 animate-pulse">
              Đang đồng bộ dữ liệu đơn hàng...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-stone-200 shadow-sm">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8 relative">
              <Package className="w-10 h-10 text-stone-200" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Search className="w-3 h-3 text-stone-300" />
              </div>
            </div>
            <h3 className="text-lg font-black text-black uppercase tracking-tight">
              Không tìm thấy đơn hàng nào
            </h3>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-3 px-6 text-center">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-8 px-10 py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-stone-200 hover:scale-105 active:scale-95 transition-all"
            >
              Xem tất cả đơn hàng
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant="user"
                onCancel={handleCancelOrder}
                updatingId={cancellingId}
              />
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-stone-100 rounded-[32px] p-6 shadow-sm gap-6">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] order-2 md:order-1">
              Hiển thị{" "}
              <span className="text-black">
                {(page - 1) * limit + 1} - {Math.min(page * limit, totalItems)}
              </span>{" "}
              trên tổng số <span className="text-black">{totalItems}</span> đơn
              hàng
            </div>

            <div className="flex items-center gap-2 order-1 md:order-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:text-black hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-2 text-stone-300">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-[10px] font-black transition-all",
                          page === p
                            ? "bg-black text-white shadow-lg shadow-stone-200"
                            : "bg-white text-stone-400 hover:bg-stone-50 border border-stone-50",
                        )}
                      >
                        {p}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:text-black hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 order-3">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                Mỗi trang
              </span>
              <Select
                value={limit.toString()}
                onChange={(val) => {
                  setLimit(Number(val));
                  setPage(1);
                }}
                options={[
                  { label: "10", value: "10" },
                  { label: "20", value: "20" },
                  { label: "50", value: "50" },
                ]}
                className="w-20"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
