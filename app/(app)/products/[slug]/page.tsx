"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  Heart,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { productApi } from "@/apis/product.api";
import { Product } from "@/types/product";
import { toast } from "react-toastify";
import InternalServerErrorPage from "@/app/error/500/page";
import ProductGallery from "@/components/products/ProductGallery";
import SizeGuide from "@/components/products/SizeGuide";
import PurchasePolicy from "@/components/products/PurchasePolicy";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("mota");

  // 1. Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProductBySlug(slug);
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          const firstColor = data.variants[0].color;
          setSelectedColor(firstColor);
        }
      } catch (err: any) {
        console.error("Fetch product error:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  // 2. Logic xử lý Biến thể
  const colors = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product]);

  const sizes = useMemo(() => {
    if (!product || !selectedColor) return [];
    return Array.from(
      new Set(
        product.variants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size),
      ),
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize,
    );
  }, [product, selectedColor, selectedSize]);

  // Reset size khi đổi màu
  useEffect(() => {
    if (product && selectedColor) {
      const availableSizes = product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size);
      if (selectedSize && !availableSizes.includes(selectedSize)) {
        setSelectedSize(null);
      }
    }
  }, [selectedColor, product, selectedSize]);

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => setQuantity(quantity + 1);

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.warning("Vui lòng chọn màu sắc");
      return;
    }
    if (!selectedSize) {
      toast.warning("Vui lòng chọn kích cỡ");
      return;
    }
    toast.success(
      `Đã thêm vào giỏ hàng: ${product?.name} (${selectedColor} - ${selectedSize})`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
          Đang tải sản phẩm...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return <InternalServerErrorPage error={error} />;
  }

  const displayPrice = selectedVariant
    ? Number(selectedVariant.price)
    : product.basePrice;
  const originalPrice = displayPrice * 1.3;

  return (
    <div className="min-h-screen bg-white pb-20 pt-2 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-black transition-colors">
            Sản phẩm
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black font-bold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              selectedColor={selectedColor}
              productName={product.name}
            />
          </div>

          {/* RIGHT: Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 fill-current",
                      i >= 5 && "text-stone-200 fill-none",
                    )}
                  />
                ))}
              </div>
              <span className="text-[9px] text-stone-400 tracking-widest uppercase font-bold">
                6 Đánh giá | 56 Đã bán
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-black mb-3 leading-tight uppercase">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-4 bg-stone-50/50 p-4 border border-stone-100/50 rounded-sm">
              <span className="text-2xl font-bold text-black tracking-tight">
                {displayPrice.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-xs text-stone-400 line-through decoration-stone-300">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
              <span className="bg-black text-white text-[10px] font-black px-1.5 py-0.5 tracking-[0.1em] uppercase ml-auto">
                -30%
              </span>
            </div>

            {/* Selection: Color */}
            <div className="mb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 block mb-2">
                Màu sắc:{" "}
                <span className="text-black">
                  {selectedColor || "Chưa chọn"}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const colorImg = product.images.find(
                    (img) => img.color === c,
                  );
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={cn(
                        "w-10 h-14 border p-0.5 transition-all overflow-hidden relative",
                        selectedColor === c
                          ? "border-black scale-105 z-10 shadow-md"
                          : "border-stone-100 hover:border-stone-300",
                      )}
                    >
                      {colorImg ? (
                        <img
                          src={colorImg.url}
                          alt={c}
                          className="w-full h-full object-cover"
                          title={c}
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[7px] font-bold text-stone-400 uppercase">
                          {c}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection: Size */}
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Kích cỡ:{" "}
                  <span className="text-black">
                    {selectedSize || "Chọn size"}
                  </span>
                </label>
                <button className="text-[10px] font-bold text-stone-400 underline underline-offset-2 hover:text-black tracking-widest uppercase transition-colors">
                  Bảng size
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "h-9 border text-[10px] font-bold transition-all flex items-center justify-center uppercase tracking-widest",
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "border-stone-100 hover:border-stone-400 text-stone-600",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions Row */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Số lượng
                </label>
                <div className="flex items-center w-24 border border-stone-200 rounded-sm">
                  <button
                    onClick={decreaseQty}
                    className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors border-r border-stone-100"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-xs">
                    {quantity < 10 ? `0${quantity}` : quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors border-l border-stone-100"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 pt-5">
                {selectedVariant && (
                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 italic">
                    * Còn {selectedVariant.inventory?.quantity || 0} sản phẩm
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-[3] bg-black text-white h-12 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Mua ngay
                </button>
                <button className="flex-1 border border-stone-200 flex items-center justify-center hover:border-black transition-all group">
                  <Heart className="w-4 h-4 text-stone-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-white border border-black text-black h-12 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition-all active:scale-[0.98]"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-stone-300" />
                <div className="leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black">
                    Giao hàng nhanh
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                    Từ 2 - 4 ngày
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-stone-300" />
                <div className="leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black">
                    Dễ dàng đổi trả
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                    Trong vòng 7 ngày
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex justify-center border-b border-stone-100 mb-10 overflow-x-auto no-scrollbar">
            {[
              { id: "mota", label: "Mô tả sản phẩm" },
              { id: "hinhanh", label: "Hình ảnh chi tiết" },
              { id: "size", label: "Hướng dẫn chọn size" },
              { id: "chinhsach", label: "Chính sách mua hàng" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap relative",
                  activeTab === tab.id
                    ? "text-black"
                    : "text-stone-400 hover:text-stone-600",
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black animate-in fade-in slide-in-from-left-1" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {activeTab === "mota" && (
              <div className="animate-in fade-in duration-500">
                <div className="whitespace-pre-line text-stone-600 text-sm leading-loose tracking-wide font-medium">
                  {product.description || "Đang cập nhật mô tả..."}
                </div>
              </div>
            )}
            {activeTab === "hinhanh" && (
              <div className="flex flex-col gap-12 animate-in fade-in duration-500">
                {product.images.map((img, i) => (
                  <div
                    key={img.id || i}
                    className="bg-stone-50 overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      alt={`detail-${i}`}
                      className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "size" && <SizeGuide />}
            {activeTab === "chinhsach" && <PurchasePolicy />}
          </div>
        </div>
      </div>
    </div>
  );
}
