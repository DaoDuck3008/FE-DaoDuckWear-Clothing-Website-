"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { ImageItem, MainImageDropzone } from "@/components/ui/ImageDropzone";

import { Variant } from "@/types/product";
import {
  CATEGORY_TREE,
  SIZES,
  STATUS_OPTIONS,
  uid,
  toSlug,
} from "@/constants/product";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("active");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [mainImages, setMainImages] = useState<ImageItem[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, ImageItem[]>>(
    {},
  );

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(toSlug(val));
  };

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      {
        id: uid(),
        size: "",
        color: "",
        price: "",
        sku: "",
        stock: "0",
      },
    ]);

  const updateVariant = <K extends keyof Variant>(
    id: string,
    field: K,
    value: Variant[K],
  ) =>
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );

  const removeVariant = (id: string) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));

  const handleColorImages = (color: string, files: File[]) => {
    const added = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setColorImages((prev) => ({
      ...prev,
      [color]: [...(prev[color] || []), ...added].slice(0, 6),
    }));
  };

  const removeColorImage = (color: string, idx: number) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: prev[color].filter((_, i) => i !== idx),
    }));
  };

  const handleSetMainColorImage = (color: string, idx: number) => {
    setColorImages((prev) => {
      const arr = [...(prev[color] || [])];
      const [moved] = arr.splice(idx, 1);
      arr.unshift(moved);
      return { ...prev, [color]: arr };
    });
  };

  // Lọc ra các màu sắc duy nhất đã thêm
  const uniqueColors = Array.from(
    new Set(variants.map((v) => v.color.trim()).filter(Boolean)),
  );

  const handleMainImages = (files: File[]) => {
    const added = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMainImages((prev) => [...prev, ...added].slice(0, 6));
  };

  const removeMainImage = (idx: number) =>
    setMainImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      slug,
      description,
      basePrice,
      categoryId,
      status,
      variants,
      mainImages,
    });
    // TODO: call API
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Page Header Action Bar ── */}
      <div className="bg-white border-b border-stone-100 mb-2">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="hover:opacity-50 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-4 w-px bg-stone-200" />
            <div>
              <span className="font-serif text-2xl font-bold tracking-tighter uppercase text-black">
                Thêm sản phẩm mới
              </span>
              <span className="hidden sm:inline text-sm uppercase tracking-widest text-stone-400 ml-3">
                Admin / Products / Create
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="px-5 py-2 text-sm font-bold uppercase tracking-widest border border-stone-200 hover:border-black transition-all text-stone-600 hover:text-black"
            >
              Hủy
            </Link>
            <button
              form="create-product-form"
              type="submit"
              className="px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <form id="create-product-form" onSubmit={handleSubmit}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* ════════════════════════════════
                    LEFT PANEL — sticky
                    ════════════════════════════════ */}
            <aside className="col-span-12 lg:col-span-4 space-y-5 lg:sticky lg:top-[56px] max-h-[calc(100vh-56px)] lg:overflow-y-auto pr-0 lg:pr-1">
              {/* Basic Info */}
              <div className="bg-white border border-stone-100 p-5 space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400 pb-2.5 border-b border-stone-50">
                  Thông tin cơ bản
                </h2>

                <div className="space-y-1 group">
                  <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 group-focus-within:text-black transition-colors">
                    Tên sản phẩm <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-transparent border-b border-stone-200 focus:border-black py-2 text-sm outline-none font-medium transition-colors placeholder:text-stone-300"
                    placeholder="Ví dụ: Quần tây nam ống rộng"
                  />
                </div>

                <div className="space-y-1 group">
                  <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 group-focus-within:text-black transition-colors flex items-center gap-1.5">
                    Slug (URL) <span className="text-red-400">*</span>
                    <AlertCircle className="w-3 h-3 text-stone-300" />
                  </label>
                  <input
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent border-b border-stone-200 focus:border-black py-2 text-sm outline-none font-mono text-stone-500 transition-colors placeholder:text-stone-300"
                    placeholder="quan-tay-nam-ong-rong"
                  />
                </div>

                <div className="space-y-1 group">
                  <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 group-focus-within:text-black transition-colors">
                    Giá gốc (VNĐ) <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2 border-b border-stone-200 focus-within:border-black transition-colors">
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      value={basePrice}
                      onChange={(e) =>
                        setBasePrice(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 bg-transparent py-2 text-sm outline-none font-medium placeholder:text-stone-300"
                      placeholder="350000"
                    />
                    <span className="text-sm text-stone-400 font-bold uppercase tracking-wider pr-1 flex-shrink-0">
                      đ
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400">
                    Danh mục
                  </label>
                  <CategorySelect
                    value={categoryId}
                    onChange={(id) => setCategoryId(id)}
                    categories={CATEGORY_TREE}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400">
                    Trạng thái
                  </label>
                  <div className="flex gap-1.5 py-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(opt.value)}
                        className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider border transition-all ${
                          status === opt.value
                            ? "bg-black text-white border-black"
                            : "bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Common/Size Guide Images */}
              <MainImageDropzone
                title="Ảnh chung / Bảng Size"
                images={mainImages}
                onAdd={handleMainImages}
                onRemove={removeMainImage}
                maxImages={3}
                isMainPanel={false}
                note="Nơi upload bảng Hướng dẫn chọn Size hoặc các ảnh quy cách đóng gói chung (không phân biệt màu sắc)."
              />
            </aside>

            {/* ════════════════════════════════
                    RIGHT PANEL
                    ════════════════════════════════ */}
            <div className="col-span-12 lg:col-span-8 space-y-5">
              {/* Description */}
              <div className="bg-white border border-stone-100 p-5 space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400 pb-2.5 border-b border-stone-50">
                  Mô tả sản phẩm
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-stone-50/50 border border-stone-100 focus:border-stone-300 p-4 text-sm outline-none resize-y text-stone-700 leading-relaxed transition-colors min-h-[120px]"
                  placeholder="Mô tả chi tiết về sản phẩm: chất liệu, kiểu dáng, hướng dẫn bảo quản..."
                />
              </div>

              {/* Variants */}
              <div className="bg-white border border-stone-100 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-50">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                      Biến thể sản phẩm
                    </h2>
                    <p className="text-sm text-stone-300 mt-0.5 tracking-wider">
                      {variants.length} biến thể — Cấu hình giá riêng và tỷ lệ
                      tồn kho
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm biến thể
                  </button>
                </div>

                {variants.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-stone-100">
                    <div className="w-10 h-10 border border-dashed border-stone-200 flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-4 h-4 text-stone-300" />
                    </div>
                    <p className="text-sm uppercase tracking-widest text-stone-300 mb-4">
                      Chưa có biến thể nào
                    </p>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-sm uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline font-medium transition-all"
                    >
                      Thêm biến thể đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="border border-stone-100 overflow-x-auto">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_100px_80px_72px_40px] min-w-[620px] bg-stone-50 border-b border-stone-100">
                      {[
                        "Size",
                        "Màu sắc",
                        "SKU",
                        "Giá riêng (đ)",
                        "Tồn kho",
                        "Thao tác",
                      ].map((h, i) => (
                        <div
                          key={i}
                          className="px-3 py-2.5 text-sm font-bold tracking-widest text-stone-400"
                        >
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Table Rows */}
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="grid grid-cols-[1fr_1fr_1fr_100px_80px_72px_40px] min-w-[620px] border-b border-stone-50 last:border-b-0 hover:bg-stone-50/60 transition-colors items-center"
                      >
                        {/* Size */}
                        <div className="p-2">
                          <select
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(variant.id, "size", e.target.value)
                            }
                            className="w-full bg-transparent text-sm font-medium outline-none border-b border-stone-100 focus:border-black py-1 transition-colors appearance-none cursor-pointer"
                          >
                            <option value="">— Size —</option>
                            {SIZES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Color */}
                        <div className="p-2">
                          <div className="flex items-center gap-2 border-b border-stone-100 focus-within:border-black transition-colors relative">
                            <input
                              value={variant.color}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="flex-1 min-w-0 bg-transparent text-sm outline-none py-1 font-medium placeholder:text-stone-300"
                              placeholder="#000 hoặc tên màu"
                            />
                            <div
                              className="w-4 h-4 shrink-0 rounded-full border border-stone-200 overflow-hidden relative cursor-pointer"
                              style={{
                                backgroundColor:
                                  variant.color &&
                                  (variant.color.startsWith("#") ||
                                    variant.color.match(/^[a-z]+$/i))
                                    ? variant.color
                                    : "#000000",
                              }}
                              title="Chọn màu / Eye dropper"
                            >
                              <input
                                type="color"
                                value={
                                  variant.color.startsWith("#") &&
                                  (variant.color.length === 4 ||
                                    variant.color.length === 7)
                                    ? variant.color
                                    : "#000000"
                                }
                                onChange={(e) =>
                                  updateVariant(
                                    variant.id,
                                    "color",
                                    e.target.value,
                                  )
                                }
                                className="absolute inset-0 w-8 h-8 -translate-x-2 -translate-y-2 opacity-0 cursor-pointer pointer-events-auto"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SKU */}
                        <div className="p-2">
                          <input
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "sku",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="w-full bg-transparent text-sm outline-none border-b border-stone-100 focus:border-black py-1 transition-colors font-mono text-stone-600 placeholder:text-stone-300"
                            placeholder="SKU-001"
                          />
                        </div>

                        {/* Price Override */}
                        <div className="p-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "price",
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            className="w-full bg-transparent text-sm outline-none border-b border-stone-100 focus:border-black py-1 transition-colors font-medium placeholder:text-stone-300"
                            placeholder={basePrice || "Mặc định"}
                          />
                        </div>

                        {/* Stock */}
                        <div className="p-2">
                          <input
                            type="number"
                            min={0}
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(variant.id, "stock", e.target.value)
                            }
                            className="w-full bg-transparent text-sm outline-none border-b border-stone-100 focus:border-black py-1 transition-colors font-medium"
                          />
                        </div>

                        {/* Delete */}
                        <div className="p-2 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="text-stone-200 hover:text-red-500 transition-colors"
                            title="Xóa biến thể"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add row inline */}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="w-full py-3 text-sm uppercase tracking-widest text-stone-300 hover:text-black hover:bg-stone-50 transition-all flex items-center justify-center gap-2 border-t border-stone-50"
                    >
                      <Plus className="w-3 h-3" />
                      Thêm hàng mới
                    </button>
                  </div>
                )}

                {/* Variant helper note */}
                {variants.length > 0 && (
                  <p className="text-sm text-stone-500 tracking-wider">
                    Nhập mã màu (VD: #fff) hoặc chữ để tải lên bộ hình ảnh. Giá
                    trống sẽ dùng giá gốc.
                  </p>
                )}
              </div>

              {/* Color grouped Images Section */}
              {uniqueColors.length > 0 && (
                <div className="bg-white border border-stone-100 p-5 space-y-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                      Bộ sưu tập hình ảnh theo màu
                    </h2>
                    <p className="text-sm text-stone-300 mt-0.5 tracking-wider">
                      Upload riêng album ảnh cho từng phân loại màu sắc
                    </p>
                  </div>

                  <div className="space-y-6">
                    {uniqueColors.map((color) => {
                      const cImages = colorImages[color] || [];
                      const colorBg =
                        color.startsWith("#") || color.match(/^[a-z]+$/i)
                          ? color
                          : "#000000";

                      return (
                        <div
                          key={color}
                          className="border border-stone-100 p-4 bg-stone-50/30"
                        >
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-stone-100/60">
                            <span
                              className="w-4 h-4 rounded-full border border-stone-200"
                              style={{ backgroundColor: colorBg }}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-black">
                              Color: {color}
                            </span>
                          </div>

                          <MainImageDropzone
                            images={cImages}
                            onAdd={(files) => handleColorImages(color, files)}
                            onRemove={(idx) => removeColorImage(color, idx)}
                            onSetMain={(idx) => handleSetMainColorImage(color, idx)}
                            maxImages={8}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
