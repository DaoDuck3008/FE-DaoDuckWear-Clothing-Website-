"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderApi } from "@/apis/order.api";
import { toast } from "react-toastify";
import {
  Search,
  ShoppingBag,
  Loader2,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OrderCard } from "@/components/order/OrderCard";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error.util";
import { Select } from "@/components/ui/Select";
import { ShopSelect } from "@/components/ui/ShopSelect";
import { shopApi } from "@/apis/shop.api";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
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
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      shopApi.getShops().then((data) => setShops(data));
    }
  }, [user]);

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
        shopId: selectedShopId || undefined,
        fromDate,
        toDate,
        page,
        limit,
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
    selectedShopId,
    fromDate,
    toDate,
    page,
    limit,
    searchTerm,
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

          {/* Shop Select for ADMIN */}
          {user?.role === "ADMIN" && (
            <div className="md:col-span-2 lg:col-span-1">
              <ShopSelect
                value={selectedShopId}
                onChange={(id) => {
                  setSelectedShopId(id);
                  setPage(1);
                }}
                shops={shops}
              />
            </div>
          )}

          <div
            className={cn(
              "md:col-span-2 grid grid-cols-2 gap-4",
              user?.role === "ADMIN" ? "lg:col-span-1" : "lg:col-span-2",
            )}
          >
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
            selectedShopId ||
            fromDate ||
            toDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPaymentStatusFilter("");
                setPaymentMethodFilter("");
                setSelectedShopId("");
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
              <OrderCard
                key={order.id}
                order={order}
                variant="admin"
                onUpdateStatus={updateStatus}
                onCancel={cancelOrder}
                updatingId={updating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders && orders.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mt-8 gap-6">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] order-2 md:order-1">
            Hiển thị{" "}
            <span className="text-slate-900">
              {(page - 1) * limit + 1} - {Math.min(page * limit, totalItems)}
            </span>{" "}
            trên tổng số <span className="text-slate-900">{totalItems}</span>{" "}
            đơn hàng
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-black hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-slate-200">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-[10px] font-black transition-all",
                        page === p
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                          : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-50",
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
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-black hover:border-black disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 order-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
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
  );
}
