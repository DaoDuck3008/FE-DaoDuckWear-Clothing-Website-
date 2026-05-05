"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { inventoryApi } from "@/apis/inventory.api";
import { Select } from "@/components/ui/Select";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Package,
  Warehouse,
  Loader2,
  RefreshCcw,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format.util";
import { handleApiError } from "@/utils/error.util";

export default function InventoryImportPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const performSearch = async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await inventoryApi.getInventory({
        search: term,
        limit: 20,
        sort: sortBy,
      });
      setResults(res.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortBy("createdAt_desc");
    setResults([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) performSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, sortBy]);

  const handleAddStock = async (
    productId: string,
    variantId: string,
    currentQty: number,
    addAmount: number,
  ) => {
    if (addAmount === 0) return;

    const newQty = Math.max(0, currentQty + addAmount);
    const updateKey = `${productId}-${variantId}`;
    setUpdating(updateKey);

    try {
      await inventoryApi.updateInventory({
        productId,
        variantId,
        quantity: newQty,
      });
      toast.success(`Đã nhập thêm ${addAmount} sản phẩm`);

      // Update local results
      setResults((prev: any[]) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              variants: p.variants.map((v: any) =>
                v.id === variantId ? { ...v, quantity: newQty } : v,
              ),
            };
          }
          return p;
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-outfit">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-500" />
            Nhập kho nhanh
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Tìm kiếm theo mã SKU hoặc tên sản phẩm để nhập hàng vào kho chi
            nhánh.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
            Chế độ nhập hàng
          </div>
        </div>
      </div>

      {/* Main Search & Tool Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="relative group flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Nhập mã SKU hoặc tên sản phẩm để tìm nhanh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30 focus:outline-none focus:border-black focus:bg-white text-base transition-all placeholder:text-slate-400 font-medium"
              />
              {loading && !searchTerm && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-black hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest whitespace-nowrap shadow-sm active:scale-95"
              title="Đặt lại tất cả bộ lọc"
            >
              <RefreshCcw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 flex items-center min-w-[200px]">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Sắp xếp theo
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
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* Product Info Bar */}
              <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-300" />
                        </div>
                      )}
                    </div>
                    {/* Small thumbnails for other images */}
                    {product.images?.length > 1 && (
                      <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                        {product.images.slice(1, 4).map((img: any, idx: number) => (
                          <div key={idx} className="w-6 h-6 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-white">
                            <img src={img.url} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {product.images.length > 4 && (
                          <div className="w-6 h-6 rounded-lg border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                            +{product.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">
                        {product.categoryId?.name}
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Gía gốc: {formatPrice(product.basePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <Link 
                     href={`/admin/inventory/import/${product.slug}`}
                     className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-2"
                   >
                     Chi tiết <ArrowRight className="w-3 h-3" />
                   </Link>
                </div>
              </div>

              {/* Variants Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.variants.map((variant: any) => {
                  const isMatchingSku =
                    searchTerm &&
                    variant.sku
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  return (
                    <div
                      key={variant.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-200",
                        isMatchingSku
                          ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500/10"
                          : "border-slate-100 bg-white hover:border-slate-300",
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 uppercase">
                              {variant.color} / {variant.size}
                            </span>
                            {isMatchingSku && (
                              <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                                Khớp SKU
                              </span>
                            )}
                          </div>
                          <code className="text-[10px] font-mono font-bold text-slate-400 block mt-1">
                            {variant.sku}
                          </code>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            Hiện có
                          </p>
                          <p className="text-sm font-black text-slate-900">
                            {variant.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="+ Số lượng"
                          className="flex-1 px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const amount = parseInt(
                                (e.target as HTMLInputElement).value,
                              );
                              if (!isNaN(amount) && amount > 0) {
                                handleAddStock(
                                  product.id,
                                  variant.id,
                                  variant.quantity,
                                  amount,
                                );
                                (e.target as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = (
                              e.currentTarget as HTMLElement
                            ).parentElement?.querySelector(
                              "input",
                            ) as HTMLInputElement;
                            const amount = parseInt(input.value);
                            if (!isNaN(amount) && amount > 0) {
                              handleAddStock(
                                product.id,
                                variant.id,
                                variant.quantity,
                                amount,
                              );
                              input.value = "";
                            }
                          }}
                          disabled={updating === `${product.id}-${variant.id}`}
                          className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                        >
                          {updating === `${product.id}-${variant.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : searchTerm && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Warehouse className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Không tìm thấy sản phẩm hoặc SKU
            </p>
          </div>
        ) : (
          !searchTerm && (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Bắt đầu nhập kho
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Quét mã SKU hoặc gõ tên sản phẩm để bắt đầu
              </p>
            </div>
          )
        )}
      </div>

      {/* Quick Help */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <p className="text-xs font-medium">
            Nhấn{" "}
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">
              Enter
            </kbd>{" "}
            để nhập hàng nhanh sau khi gõ số lượng.
          </p>
        </div>
      </div>
    </div>
  );
}
