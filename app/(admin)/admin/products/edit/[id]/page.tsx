"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Trash2, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { ShopSelect } from "@/components/ui/ShopSelect";
import {
  MainImageDropzone,
  EditableImageDropzone,
} from "@/components/ui/ImageDropzone";
import { ColorDropdown } from "@/components/ui/ColorDropdown";
import { STATUS_OPTIONS, SIZES } from "@/constants/product";
import { LoadingLayer } from "@/components/ui/LoadingLayer";
import { useProductEdit } from "@/hooks/product/useProductEdit";
import { StatusModal } from "@/components/ui/StatusModal";
import { useState } from "react";
import RoleGuard from "@/components/guards/roleGuard";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const {
    name,
    setName,
    slug,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    variants,
    updateVariant,
    generateAutoSKUs,
    existingMainImages,
    existingColorImages,
    removeExistingMainImage,
    setMainExistingImage,
    removeExistingColorImage,
    newMainImages,
    newColorImages,
    addNewMainImages,
    removeNewMainImage,
    addNewColorImages,
    removeNewColorImage,
    loading,
    isSubmitting,
    loadingMessage,
    categories,
    colors,
    uniqueColors,
    user,
    addVariant,
    removeVariant,
    handleSubmit,
  } = useProductEdit(id);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

  const confirmDeleteVariant = (vId: string) => {
    // Nếu là biến thể mới thêm (bắt đầu bằng new-), cho phép xóa luôn không cần hỏi
    if (vId.startsWith("new-")) {
      removeVariant(vId);
      return;
    }
    setVariantToDelete(vId);
    setDeleteModalOpen(true);
  };

  const handleDeleteVariant = () => {
    if (variantToDelete) {
      removeVariant(variantToDelete);
      setDeleteModalOpen(false);
      setVariantToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
        <p className="text-sm font-bold uppercase tracking-widest text-stone-400">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

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
                  Chỉnh sửa sản phẩm
                </span>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {slug}
                </p>
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
                form="edit-product-form"
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-10 py-2.5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:bg-stone-300"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>

        <form id="edit-product-form" onSubmit={handleSubmit}>
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* LEFT ASIDE */}
              <aside className="col-span-12 lg:col-span-4 space-y-5 lg:sticky lg:top-20 h-fit">
                <div className="bg-white border border-stone-100 p-5 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400 pb-2.5 border-b border-stone-50">
                    Thông tin cơ bản
                  </h2>

                  {/* Tên */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1.5">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 focus:border-stone-300 p-3 text-sm outline-none transition-colors"
                      placeholder="Tên sản phẩm"
                    />
                  </div>

                  {/* Slug (read-only) */}
                  <div className="space-y-1">
                    <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400 flex items-center gap-1.5">
                      Slug (URL)
                      <AlertCircle className="w-3 h-3 text-stone-300" />
                    </label>
                    <p className="w-full bg-transparent border-b border-stone-100 py-2 text-sm outline-none font-mono text-stone-400">
                      {slug}
                    </p>
                  </div>

                  {/* Giá */}
                  <div className="space-y-1">
                    <label className="text-sm uppercase tracking-[0.2em] font-bold text-stone-400">
                      Giá gốc (VNĐ)
                    </label>
                    <div className="flex items-center gap-2 border-b border-stone-200 focus-within:border-black transition-colors">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={basePrice}
                        onChange={(e) =>
                          setBasePrice(e.target.value.replace(/\D/g, ""))
                        }
                        className="flex-1 bg-transparent py-2 text-sm outline-none font-medium"
                      />
                      <span className="text-sm text-stone-400 font-bold uppercase tracking-wider pr-1 flex-shrink-0">
                        đ
                      </span>
                    </div>
                  </div>

                  {/* Danh mục */}
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

                  {/* Trạng thái */}
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
                              : "bg-white text-stone-400 border-stone-200 hover:border-stone-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ảnh chung */}
                <EditableImageDropzone
                  title="Ảnh chung / Bảng size"
                  existingImages={existingMainImages}
                  newImages={newMainImages}
                  onAddNew={addNewMainImages}
                  onRemoveExisting={removeExistingMainImage}
                  onRemoveNew={removeNewMainImage}
                  onSetMainExisting={setMainExistingImage}
                  maxImages={3}
                  note="Ảnh bảng hướng dẫn size, quy cách đóng gói. Badge xanh dương = ảnh cloud cũ, badge xanh lá = ảnh mới sẽ upload."
                />
              </aside>

              {/* RIGHT PANEL */}
              <div className="col-span-12 lg:col-span-8 space-y-5">
                {/* Mô tả */}
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

                {/* Biến thể */}
                <div className="bg-white border border-stone-100 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-50">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                        Biến thể sản phẩm
                      </h2>
                      <p className="text-sm text-stone-300 mt-0.5 tracking-wider">
                        {variants.length} biến thể — Giá riêng biệt
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black bg-stone-50 px-3 py-1.5 border border-stone-200 hover:bg-stone-100 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm biến thể
                      </button>
                      {variants.length > 0 && (
                        <button
                          type="button"
                          onClick={generateAutoSKUs}
                          className="text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline transition-all"
                        >
                          Tự động tạo SKU
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Array.from(
                      new Set(variants.map((v) => v.color.trim())),
                    ).map((color, cIdx) => {
                      const colorVariants = variants.filter(
                        (v) => v.color.trim() === color,
                      );

                      return (
                        <div
                          key={`group-${cIdx}`}
                          className="border border-stone-100 bg-stone-50/10"
                        >
                          <div className="flex items-center justify-between bg-stone-50 px-4 py-3 border-b border-stone-100">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-stone-300 border border-stone-200" />
                              <span className="text-sm font-bold uppercase tracking-wider">
                                {color}
                              </span>
                              <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                                ({colorVariants.length} size)
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="grid grid-cols-[100px_100px_1fr_100px_40px] gap-4 mb-2 px-1">
                              {["Màu", "Size", "SKU", "Giá", ""].map((h, i) => (
                                <div
                                  key={i}
                                  className="text-[10px] font-bold uppercase tracking-widest text-stone-400"
                                >
                                  {h}
                                </div>
                              ))}
                            </div>

                            <div className="space-y-3">
                              {colorVariants.map((v) => (
                                <div
                                  key={v.id}
                                  className="grid grid-cols-[100px_100px_1fr_100px_40px] gap-4 items-center"
                                >
                                  <input
                                    value={v.color}
                                    onChange={(e) =>
                                      updateVariant(
                                        v.id,
                                        "color",
                                        e.target.value.toUpperCase(),
                                      )
                                    }
                                    className="w-full bg-white border border-stone-100 px-2 py-2 text-[11px] font-bold uppercase outline-none focus:border-stone-300"
                                  />
                                  <select
                                    value={v.size}
                                    onChange={(e) =>
                                      updateVariant(
                                        v.id,
                                        "size",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full bg-white border border-stone-100 px-2 py-2 text-[11px] font-bold uppercase outline-none focus:border-stone-300"
                                  >
                                    {SIZES.map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    value={v.sku}
                                    onChange={(e) =>
                                      updateVariant(v.id, "sku", e.target.value)
                                    }
                                    className="w-full bg-white border border-stone-100 px-3 py-2 text-sm outline-none focus:border-stone-300 transition-colors"
                                    placeholder="Mã SKU..."
                                  />
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={v.price}
                                    onChange={(e) =>
                                      updateVariant(
                                        v.id,
                                        "price",
                                        e.target.value.replace(/\D/g, ""),
                                      )
                                    }
                                    className="w-full bg-white border border-stone-100 px-3 py-2 text-sm outline-none focus:border-stone-300 transition-colors"
                                    placeholder="Giá..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => confirmDeleteVariant(v.id)}
                                    className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                                    title="Xóa biến thể này"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ảnh theo màu */}
                {uniqueColors.length > 0 && (
                  <div className="bg-white border border-stone-100 p-5 space-y-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-400">
                        Bộ sưu tập ảnh theo màu
                      </h2>
                      <p className="text-sm text-stone-300 mt-0.5 tracking-wider">
                        Xóa ảnh cũ hoặc thêm ảnh mới cho từng màu
                      </p>
                    </div>

                    <div className="space-y-8">
                      {uniqueColors.map((color) => (
                        <div key={color} className="space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                            <div className="w-4 h-4 rounded-full bg-black" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                              Màu sắc: {color}
                            </span>
                          </div>
                          <EditableImageDropzone
                            existingImages={existingColorImages[color] || []}
                            newImages={newColorImages[color] || []}
                            onAddNew={(files) =>
                              addNewColorImages(color, files)
                            }
                            onRemoveExisting={(imgId) =>
                              removeExistingColorImage(color, imgId)
                            }
                            onRemoveNew={(idx) =>
                              removeNewColorImage(color, idx)
                            }
                            maxImages={8}
                            note={`Album ảnh riêng cho màu ${color}.`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        <StatusModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDeleteVariant()}
          type="warning"
          title="Xác nhận xóa biến thể"
          description="Việc xóa này có thể ảnh hưởng tới quá trình kinh doanh ở các cửa hàng, bạn có chắc không? Bạn vẫn có thể hoàn tác khi nhấn Hủy thay đổi ở phía trên."
          confirmText="Tôi chắc chắn"
          cancelText="Để tôi xem lại"
        />
      </div>
    </RoleGuard>
  );
}
