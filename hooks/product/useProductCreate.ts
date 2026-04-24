import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Variant } from "@/types/product";
import { uid, toSlug, generateSKU } from "@/utils/product.util";
import {
  validateProductForm,
  ProductFormErrors,
} from "@/validators/product.validator";
import { productApi } from "@/apis/product.api";
import { shopApi } from "@/apis/shop.api";
import { categoryApi } from "@/apis/category.api";
import { CategoryNode } from "@/components/ui/CategorySelect";
import { Shop } from "@/components/ui/ShopSelect";
import { ImageItem } from "@/components/ui/ImageDropzone";
import { handleApiError } from "@/utils/error.util";

/**
 * Custom hook quản lý logic form sản phẩm.
 * Sử dụng import trực tiếp: import { useProductCreate } from "@/hooks/product/useProductCreate";
 */
export const useProductCreate = () => {
  const router = useRouter();

  // --- States ---
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shopId, setShopId] = useState("");
  const [status, setStatus] = useState("active");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [mainImages, setMainImages] = useState<ImageItem[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, ImageItem[]>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Đang xử lý...");
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  // --- Effects ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, shopsData] = await Promise.all([
          categoryApi.getCategories(),
          shopApi.getShops(),
        ]);
        setCategories(categoriesData);
        setShops(shopsData);
      } catch (error) {
        handleApiError(error, "Lỗi khi lấy dữ liệu ban đầu");
      }
    };
    fetchInitialData();
  }, []);

  // --- Computed ---
  const uniqueColors = Array.from(
    new Set(variants.map((v) => v.color.trim()).filter(Boolean)),
  );

  // --- Handlers ---
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(toSlug(val));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: uid(),
        size: "M",
        color: "",
        price: "",
        sku: "",
        stock: "0",
      },
    ]);
  };

  const addSizeToColor = (color: string) => {
    setVariants((prev) => [
      ...prev,
      {
        id: uid(),
        size: "",
        color: color,
        price: "",
        sku: "",
        stock: "0",
      },
    ]);
  };

  const updateVariant = <K extends keyof Variant>(
    id: string,
    field: K,
    value: Variant[K],
  ) => {
    setVariants((prev) => {
      const currentVariant = prev.find((v) => v.id === id);
      if (!currentVariant) return prev;

      if (field === "size" && value !== "") {
        const isDuplicate = prev.some(
          (v) =>
            v.id !== id &&
            v.color.trim().toUpperCase() ===
              currentVariant.color.trim().toUpperCase() &&
            v.size === value,
        );

        if (isDuplicate) {
          toast.error(
            `Size ${value} đã tồn tại cho màu ${currentVariant.color}`,
          );
          return prev;
        }
      }

      return prev.map((v) => (v.id === id ? { ...v, [field]: value } : v));
    });
  };

  const updateColorGroup = (oldColor: string, newColor: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.color === oldColor ? { ...v, color: newColor } : v)),
    );
  };

  const removeVariant = (id: string) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));

  const removeColorGroup = (color: string) => {
    setVariants((prev) => prev.filter((v) => v.color !== color));
  };

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

  const handleMainImages = (files: File[]) => {
    const added = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMainImages((prev) => [...prev, ...added].slice(0, 6));
  };

  const removeMainImage = (idx: number) =>
    setMainImages((prev) => prev.filter((_, i) => i !== idx));

  const generateAutoSKUs = () => {
    if (!name) {
      toast.warning("Vui lòng nhập tên sản phẩm trước");
      return;
    }

    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        sku: generateSKU(name, v.color, v.size),
      })),
    );
    toast.info("Đã cập nhật mã SKU cho toàn bộ biến thể");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateProductForm({
      name,
      categoryId,
      shopId,
      basePrice,
      variants,
      mainImages,
      colorImages,
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setLoadingMessage("Đang chuẩn bị dữ liệu...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("basePrice", basePrice.toString());
      formData.append("categoryId", categoryId);
      formData.append("shopId", shopId);
      formData.append("status", status);
      formData.append("variants", JSON.stringify(variants));

      mainImages.forEach((img, idx) => {
        formData.append(`common_${idx}`, img.file);
      });

      Object.keys(colorImages).forEach((color) => {
        colorImages[color].forEach((img, idx) => {
          formData.append(`color:${color}_${idx}`, img.file);
        });
      });

      setLoadingMessage("Đang upload ảnh và lưu sản phẩm...");
      await productApi.createProduct(formData);

      toast.success("Tạo sản phẩm thành công!");
      router.push("/admin/products");
    } catch (error: any) {
      handleApiError(error, "Lỗi khi tạo sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Flattened States
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    categoryId,
    setCategoryId,
    shopId,
    setShopId,
    status,
    setStatus,
    variants,
    setVariants,
    mainImages,
    colorImages,
    isSubmitting,
    loadingMessage,
    categories,
    shops,
    errors,
    uniqueColors,
    // Flattened Handlers
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
  };
};
