"use client";

import { useEffect, useState } from "react";
import { inventoryApi } from "@/apis/inventory.api";
import { categoryApi } from "@/apis/category.api";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { Select } from "@/components/ui/Select";
import { toast } from "react-toastify";
import {
  Search,
  Package,
  Warehouse,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  RefreshCcw,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format.util";
import { handleApiError } from "@/utils/error.util";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { ShopSelect } from "@/components/ui/ShopSelect";
import { shopApi } from "@/apis/shop.api";

export default function InventoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      shopApi.getShops().then((res) => setShops(res));
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inventoryRes, categoriesRes] = await Promise.all([
        inventoryApi.getInventory({
          search: searchTerm,
          categoryId: selectedCategory,
          sort: sortBy,
          shopId: selectedShopId || undefined,
          page,
          limit,
        }),
        categories.length === 0
          ? categoryApi.getCategories()
          : Promise.resolve(null),
      ]);

      setData(inventoryRes.data);
      setTotalPages(inventoryRes.totalPages || 1);
      setTotalItems(inventoryRes.total || 0);

      if (categoriesRes) setCategories(categoriesRes);

      if (searchTerm) {
        setExpandedProducts(inventoryRes.data.map((p: any) => p.id));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy, selectedShopId, page, limit]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy, searchTerm, selectedShopId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("createdAt_desc");
    setSelectedShopId("");
    setPage(1);
  };

  const toggleProduct = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-outfit">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <Warehouse className="w-6 h-6 text-slate-900" />
            Bảng tồn kho -{" "}
            {user?.role === "ADMIN"
              ? shops.find((s) => s.id === selectedShopId)?.name || "Toàn hệ thống"
              : user?.shop?.name}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Theo dõi và quản lý số lượng tồn kho của tất cả sản phẩm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-black rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <RefreshCcw
              className={cn("w-3.5 h-3.5", loading && "animate-spin")}
            />
            Làm mới
          </button>
          <Link
            href={
              user?.role === "ADMIN" && selectedShopId
                ? `/admin/inventory/import?shopId=${selectedShopId}`
                : "/admin/inventory/import"
            }
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95",
              user?.role === "ADMIN" && !selectedShopId
                ? "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none shadow-none"
                : "bg-slate-900 text-white hover:bg-black",
            )}
            onClick={(e) => {
              if (user?.role === "ADMIN" && !selectedShopId) e.preventDefault();
            }}
          >
            <Warehouse className="w-3.5 h-3.5" />
            Nhập kho nhanh
          </Link>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-100/50 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="md:col-span-5 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Tìm kiếm sản phẩm
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Tên, slug hoặc SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-transparent border-b border-slate-200 focus:border-black focus:outline-none text-sm transition-all font-medium placeholder:text-slate-300"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Danh mục
            </label>
            <CategorySelect
              value={selectedCategory}
              onChange={(id) => setSelectedCategory(id)}
              categories={categories}
            />
          </div>

          {/* Sort Filter */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Sắp xếp
            </label>
            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                { value: "createdAt_desc", label: "Mới nhất" },
                { value: "createdAt_asc", label: "Cũ nhất" },
                { value: "name_asc", label: "Tên A-Z" },
                { value: "name_desc", label: "Tên Z-A" },
              ]}
            />
          </div>

          {/* Shop Select for ADMIN */}
          {user?.role === "ADMIN" && (
            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Chi nhánh
              </label>
              <ShopSelect
                value={selectedShopId}
                onChange={(id) => setSelectedShopId(id)}
                shops={shops}
              />
            </div>
          )}

          {/* Reset Button */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={handleReset}
              className="p-3 bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-all shadow-sm"
              title="Xóa bộ lọc"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Đang tải dữ liệu kho...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg">Trống rỗng</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                Không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.map((product) => (
              <div key={product.id} className="flex flex-col">
                {/* Product Header Row */}
                <div
                  onClick={() => toggleProduct(product.id)}
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        {product.categoryId?.name || "Sản phẩm"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {product.variants.length} Phân loại
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden lg:block text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {selectedShopId || user?.role !== "ADMIN" ? "Tại chi nhánh" : "Tổng tồn kho"}
                      </p>
                      <p className="text-base font-black text-slate-900">
                        {product.variants.reduce(
                          (acc: number, v: any) => acc + (v.quantity || 0),
                          0,
                        )}
                      </p>
                    </div>

                    <Link
                      href={`/admin/inventory/import/${product.slug}${selectedShopId ? `?shopId=${selectedShopId}` : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user?.role === "ADMIN" && !selectedShopId) e.preventDefault();
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-2",
                        user?.role === "ADMIN" && !selectedShopId
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                          : "bg-slate-900 text-white hover:bg-black",
                      )}
                    >
                      Quản lý <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {expandedProducts.includes(product.id) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-black transition-colors" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-black transition-colors" />
                    )}
                  </div>
                </div>

                {/* Variants List (Collapsible) */}
                {expandedProducts.includes(product.id) && (
                  <div className="bg-slate-50/30 border-t border-slate-50 px-6 py-2 overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                          <th className="py-4 text-left">
                            Phân loại (Màu & Size)
                          </th>
                          <th className="py-4 text-center">Mã SKU</th>
                          <th className="py-4 text-center">Đang đặt hàng</th>
                          <th className="py-4 text-right">
                            {selectedShopId || user?.role !== "ADMIN" ? "Số lượng tồn kho" : "Tổng tồn kho"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {product.variants.map((variant: any) => (
                          <tr key={variant.id} className="group/row">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm flex-shrink-0">
                                  {variant.image ? (
                                    <img
                                      src={variant.image}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                      <Package className="w-4 h-4 text-slate-200" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    {variant.color} / {variant.size}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                    {formatPrice(variant.price)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <code className="text-[10px] font-black bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-mono">
                                {variant.sku}
                              </code>
                            </td>
                            <td className="py-4 text-center">
                              <span
                                className={cn(
                                  "text-xs font-black",
                                  variant.reservedQuantity > 0
                                    ? "text-orange-500"
                                    : "text-slate-200",
                                )}
                              >
                                {variant.reservedQuantity}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900">
                                  {variant.quantity}{" "}
                                  <span className="text-[10px] text-slate-400 font-bold ml-1">
                                    SẢN PHẨM
                                  </span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {!loading && data.length > 0 && (
          <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Hiển thị {data.length} trên tổng số {totalItems} sản phẩm
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  // Hiển thị tối đa 5 trang xung quanh trang hiện tại
                  if (
                    totalPages > 7 &&
                    p !== 1 &&
                    p !== totalPages &&
                    Math.abs(p - page) > 2
                  ) {
                    if (Math.abs(p - page) === 3)
                      return (
                        <span key={p} className="px-2 text-slate-300">
                          ...
                        </span>
                      );
                    return null;
                  }

                  return (
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
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Mỗi trang
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer focus:border-black transition-all shadow-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 py-8 border-t border-slate-100">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          Hệ thống quản lý tồn kho DaoDuck Wear v1.2
        </p>
      </div>
    </div>
  );
}
