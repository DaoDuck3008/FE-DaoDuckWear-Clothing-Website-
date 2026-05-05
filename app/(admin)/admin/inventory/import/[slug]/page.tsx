"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { inventoryApi } from "@/apis/inventory.api";
import { useAuthStore } from "@/stores/auth.store";
import { ShopSelect } from "@/components/ui/ShopSelect";
import { shopApi } from "@/apis/shop.api";
import { Select } from "@/components/ui/Select";
import { toast } from "react-toastify";
import {
  Search,
  Package,
  Loader2,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format.util";
import { handleApiError } from "@/utils/error.util";

export default function ProductInventoryPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"sku" | "quantity" | "name">("name");
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState(
    searchParams.get("shopId") || "",
  );

  useEffect(() => {
    if (user?.role === "ADMIN") {
      shopApi.getShops().then((res) => setShops(res));
    }
  }, [user]);

  useEffect(() => {
    const sId = searchParams.get("shopId");
    if (sId) setSelectedShopId(sId);
  }, [searchParams]);

  const fetchProductData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await inventoryApi.getProductInventory(
        slug as string,
        selectedShopId || undefined,
      );
      setProduct(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug, selectedShopId]);

  // Lọc và sắp xếp variants local
  const filteredVariants = useMemo(() => {
    if (!product) return [];

    let variants = [...product.variants];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      variants = variants.filter(
        (v) =>
          v.sku.toLowerCase().includes(lowerSearch) ||
          v.color.toLowerCase().includes(lowerSearch) ||
          v.size.toLowerCase().includes(lowerSearch),
      );
    }

    // Sort logic
    variants.sort((a, b) => {
      if (sortBy === "sku") return a.sku.localeCompare(b.sku);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return a.color.localeCompare(b.color); // default by color/name
    });

    return variants;
  }, [product, searchTerm, sortBy]);

  const handleUpdate = async (variantId: string, quantity: number) => {
    if (!product) return;
    setUpdating(variantId);
    try {
      await inventoryApi.updateInventory({
        productId: product.id,
        variantId,
        quantity,
        shopId: selectedShopId || undefined,
      });
      toast.success("Đã cập nhật tồn kho");
      // Update local state
      setProduct((prev: any) => ({
        ...prev,
        variants: prev.variants.map((v: any) =>
          v.id === variantId ? { ...v, quantity } : v,
        ),
      }));
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddStock = async (
    variantId: string,
    currentQty: number,
    addAmount: number,
  ) => {
    if (addAmount === 0) return;
    const newQty = Math.max(0, currentQty + addAmount);
    await handleUpdate(variantId, newQty);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("name");
  };

  if (loading && !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Đang lấy dữ liệu sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Sản phẩm không tồn tại.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-black font-bold uppercase text-xs flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-outfit">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
              Tồn kho: {product.name} -{" "}
              {user?.role === "ADMIN"
                ? shops.find((s) => s.id === selectedShopId)?.name ||
                  "Toàn hệ thống"
                : user?.shop?.name}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-2">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {product.categoryId?.name}
              </span>
              <span>Quản lý chi tiết từng phân loại sản phẩm.</span>
            </p>
          </div>
        </div>
        {user?.role === "ADMIN" && (
          <div className="w-64">
            <ShopSelect
              value={selectedShopId}
              onChange={(id) => setSelectedShopId(id)}
              shops={shops}
            />
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Search within product */}
        <div className="flex-1 relative flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Tìm theo SKU, Màu sắc hoặc Kích cỡ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all font-medium"
            />
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-bold uppercase text-[10px] tracking-widest whitespace-nowrap shadow-lg active:scale-95"
            title="Đặt lại bộ lọc"
          >
            <RefreshCcw className="w-4 h-4" />
            Làm mới
          </button>
        </div>

        {/* Sort Switcher */}
        <div className="bg-white p-2 px-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[200px]">
          <div className="flex flex-col w-full">
            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              Sắp xếp
            </label>
            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={[
                { value: "name", label: "Tên sản phẩm" },
                { value: "sku", label: "Mã SKU" },
                { value: "quantity", label: "Số lượng tồn" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-start gap-8 bg-slate-50/30">
          <div className="relative group flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[32px] overflow-hidden border-4 border-white shadow-xl bg-white transition-transform group-hover:scale-[1.02] duration-500">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <Package className="w-12 h-12 text-slate-200" />
                </div>
              )}
            </div>
            {/* Other Images Thumbnails */}
            {product.images?.length > 1 && (
              <div className="absolute -bottom-2 -right-2 flex -space-x-4">
                {product.images.slice(1, 4).map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white group-hover:translate-x-1 transition-transform"
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
                {product.images.length > 4 && (
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                    +{product.images.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                {product.status === "active"
                  ? "Đang kinh doanh"
                  : "Ngừng kinh doanh"}
              </span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {product.variants.length} Phân loại
              </span>
              <span className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                Giá gốc: {formatPrice(product.basePrice)}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Mô tả sản phẩm
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
                {product.description || "Không có mô tả cho sản phẩm này."}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Danh mục
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {product.categoryId?.name}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Mã sản phẩm
                </span>
                <code className="text-sm font-bold text-slate-600">
                  {product.slug}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-slate-50/10">
          {filteredVariants.map((variant) => (
            <div
              key={variant.id}
              className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                    {variant.image ? (
                      <img
                        src={variant.image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-200" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                      {variant.color} / {variant.size}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {formatPrice(variant.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-1">
                    {selectedShopId || user?.role !== "ADMIN"
                      ? "Tồn kho"
                      : "Tổng tồn"}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {variant.quantity}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <code className="text-[10px] font-black bg-slate-50 px-2.5 py-1.5 rounded-lg text-slate-500 font-mono border border-slate-100">
                    {variant.sku}
                  </code>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Đang đặt:
                    </span>
                    <span
                      className={cn(
                        "text-xs font-black",
                        variant.reservedQuantity > 0
                          ? "text-orange-500"
                          : "text-slate-300",
                      )}
                    >
                      {variant.reservedQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="+ Số lượng"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-sm font-black placeholder:text-slate-300"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const amount = parseInt(
                            (e.target as HTMLInputElement).value,
                          );
                          if (!isNaN(amount) && amount !== 0) {
                            handleAddStock(
                              variant.id,
                              variant.quantity,
                              amount,
                            );
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      const input = (
                        e.currentTarget as HTMLElement
                      ).parentElement?.querySelector(
                        "input",
                      ) as HTMLInputElement;
                      const amount = parseInt(input.value);
                      if (!isNaN(amount) && amount !== 0) {
                        handleAddStock(variant.id, variant.quantity, amount);
                        input.value = "";
                      }
                    }}
                    disabled={
                      updating === variant.id ||
                      (user?.role === "ADMIN" && !selectedShopId)
                    }
                    className={cn(
                      "p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center",
                      user?.role === "ADMIN" && !selectedShopId
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-slate-900 text-white hover:bg-black shadow-slate-200",
                    )}
                  >
                    {updating === variant.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVariants.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">
              Không tìm thấy phân loại nào khớp
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {/* <div className="flex items-center justify-center gap-2 pt-4">
        <Warehouse className="w-4 h-4 text-slate-300" />
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Dữ liệu kho thời gian thực cho {product.name}
        </p>
      </div> */}
    </div>
  );
}
