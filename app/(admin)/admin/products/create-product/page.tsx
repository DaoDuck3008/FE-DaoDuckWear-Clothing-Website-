"use client";

import Link from "next/link";
import { Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { ShopSelect } from "@/components/ui/ShopSelect";
import { MainImageDropzone } from "@/components/ui/ImageDropzone";
import { ColorDropdown } from "@/components/ui/ColorDropdown";

import { STATUS_OPTIONS, SIZES } from "@/constants/product";
import { LoadingLayer } from "@/components/ui/LoadingLayer";
import { useProductCreate } from "@/hooks/product/useProductCreate";
import RoleGuard from "@/components/guards/roleGuard";

/**
 * Trang tạo sản phẩm mới.
 * Sử dụng hook useProductCreate để quản lý logic.
 */
export default function CreateProductPage() {
  const {
    name,
    slug,
    setSlug,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    variants,
    mainImages,
    colorImages,
    isSubmitting,
    loadingMessage,
    categories,

    colors,
    errors,
    uniqueColors,
    handleNameChange,
    addVariant,
    addSizeToColor,
    updateVariant,
    updateColorGroup,
    removeVariant,
    removeColorGroup,
    handleColorImages,
    removeColorImage,
    handleSetMainColorImage,
    handleMainImages,
    removeMainImage,
    generateAutoSKUs,
    handleSubmit,
    user,
  } = useProductCreate();

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-full bg-stone-50 pb-24">
        <LoadingLayer isLoading={isSubmitting} message={loadingMessage} />

        {/* Header Bar */}
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
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/products"
                className="px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
              >
                Hủy bỏ
              </Link>
              <button
                form="create-product-form"
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-10 py-2.5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:bg-stone-300"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
              </button>
            </div>
          </div>
        </div>

        <form id="create-product-form" onSubmit={handleSubmit}>
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* LEFT ASIDE: Basic Info */}
              <aside className="col-span-12 lg:col-span-4 space-y-5 lg:sticky lg:top-20 h-fit pr-0 lg:pr-1">
                <div className="bg-white border border-stone-100 p-5 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400 pb-2.5 border-b border-stone-50">
                    Thông tin cơ bản
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1.5">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className={`w-full bg-stone-50 border ${errors.name ? "border-red-300" : "border-stone-100"} focus:border-stone-300 p-3 text-sm outline-none transition-colors`}
                        placeholder="VD: Quần tây nam ống suông"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-[10px] uppercase mt-1 tracking-wider">
                          {errors.name}
                        </p>
                      )}
                    </div>
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
                      categories={categories}
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
                  note="Nơi upload bảng Hướng dẫn chọn Size hoặc các ảnh quy cách đóng gói chung."
                />
              </aside>

              {/* RIGHT PANEL: Description & Variants */}
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
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>

                {/* Variants Section */}
                <div className="bg-white border border-stone-100 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-50">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                        Biến thể sản phẩm
                      </h2>
                      <p className="text-sm text-stone-300 mt-0.5 tracking-wider">
                        {variants.length} biến thể — Cấu hình giá riêng và tồn
                        kho
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {variants.length > 0 && (
                        <button
                          type="button"
                          onClick={generateAutoSKUs}
                          className="text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline transition-all"
                        >
                          Tự động tạo SKU
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm biến thể
                      </button>
                    </div>
                  </div>

                  {variants.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-stone-100">
                      <p className="text-sm uppercase tracking-widest text-stone-300 mb-4">
                        Chưa có biến thể màu sắc nào
                      </p>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="text-sm uppercase tracking-widest text-black underline underline-offset-4 font-medium transition-all"
                      >
                        Thêm màu sắc đầu tiên
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Render Grouped by Color */}
                      {Array.from(
                        new Set(variants.map((v) => v.color.trim())),
                      ).map((color, cIdx) => {
                        const colorVariants = variants.filter(
                          (v) => v.color.trim() === color,
                        );
                        const currentColorHexId = colorVariants[0]?.colorHexId;

                        return (
                          <div
                            key={colorVariants[0]?.id || `group-${cIdx}`}
                            className="border border-stone-100 bg-stone-50/10"
                          >
                            {/* Color Group Header */}
                            <div className="flex items-center justify-between bg-stone-50 px-4 py-3 border-b border-stone-100">
                              <div className="flex gap-4">
                                <div className="flex flex-col gap-1 w-48">
                                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                                    Tên màu hiển thị
                                  </label>
                                  <input
                                    value={color}
                                    onChange={(e) =>
                                      updateColorGroup(color, e.target.value)
                                    }
                                    className="bg-transparent border-b border-stone-200 focus:border-black outline-none text-sm font-bold uppercase tracking-wider py-0.5 transition-colors"
                                    placeholder="VD: Đen nhám"
                                  />
                                </div>

                                <div className="flex flex-col gap-1 w-48">
                                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                                    Mã màu chuẩn (Filter)
                                  </label>
                                  <ColorDropdown
                                    options={colors}
                                    value={currentColorHexId}
                                    onChange={(newColorObj) => {
                                      updateColorGroup(
                                        color,
                                        newColorObj.name,
                                        newColorObj.id,
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeColorGroup(color)}
                                className="text-stone-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Sizes Table */}
                            <div className="p-4">
                              <div className="grid grid-cols-[120px_1fr_120px_48px] gap-4 mb-2 px-1">
                                {["Size", "SKU", "Giá riêng", ""].map(
                                  (h, i) => (
                                    <div
                                      key={i}
                                      className="text-[10px] font-bold uppercase tracking-widest text-stone-400"
                                    >
                                      {h}
                                    </div>
                                  ),
                                )}
                              </div>

                              <div className="space-y-3">
                                {colorVariants.map((v) => (
                                  <div
                                    key={v.id}
                                    className="grid grid-cols-[120px_1fr_120px_48px] gap-4 items-center group"
                                  >
                                    <select
                                      value={v.size}
                                      onChange={(e) =>
                                        updateVariant(
                                          v.id,
                                          "size",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-white border border-stone-100 px-3 py-2 text-sm outline-none focus:border-stone-300 transition-colors cursor-pointer"
                                    >
                                      <option value="">— Size —</option>
                                      {SIZES.map((s) => {
                                        const isUsed = colorVariants.some(
                                          (cv) =>
                                            cv.size === s && cv.id !== v.id,
                                        );
                                        return (
                                          <option
                                            key={s}
                                            value={s}
                                            disabled={isUsed}
                                          >
                                            {s} {isUsed ? "(Đã chọn)" : ""}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    <input
                                      value={v.sku}
                                      onChange={(e) =>
                                        updateVariant(
                                          v.id,
                                          "sku",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-white border border-stone-100 px-3 py-2 text-sm outline-none focus:border-stone-300 transition-colors"
                                    />

                                    <input
                                      type="number"
                                      value={v.price}
                                      onChange={(e) =>
                                        updateVariant(
                                          v.id,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full bg-white border border-stone-100 px-3 py-2 text-sm outline-none focus:border-stone-300 transition-colors"
                                    />

                                    <button
                                      type="button"
                                      onClick={() => removeVariant(v.id)}
                                      className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all p-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  addSizeToColor(color, currentColorHexId)
                                }
                                className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-black transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Thêm Size cho màu {color || "này"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={addVariant}
                        className="w-full py-4 text-sm font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-black border border-dashed border-stone-200 hover:border-black transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm Nhóm Màu Mới
                      </button>
                    </div>
                  )}
                  {errors.variants && (
                    <p className="text-red-500 text-[10px] uppercase mt-2 tracking-wider font-bold">
                      {errors.variants}
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
                        Upload album ảnh riêng cho từng màu
                      </p>
                    </div>

                    <div className="space-y-8">
                      {uniqueColors.map((color) => {
                        const cImages = colorImages[color] || [];
                        return (
                          <div key={color} className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                              <div className="w-4 h-4 rounded-full bg-black" />
                              <span className="text-xs font-bold uppercase tracking-widest">
                                Màu sắc: {color}
                              </span>
                            </div>
                            <MainImageDropzone
                              images={cImages}
                              onAdd={(files) => handleColorImages(color, files)}
                              onRemove={(idx) => removeColorImage(color, idx)}
                              onSetMain={(idx) =>
                                handleSetMainColorImage(color, idx)
                              }
                              maxImages={8}
                              note={`Album ảnh dành riêng cho phân loại màu ${color}.`}
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
    </RoleGuard>
  );
}
