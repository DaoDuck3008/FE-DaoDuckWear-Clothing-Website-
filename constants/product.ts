// ─── Mock Category Tree ─────────────────────────────────────────────────────
export const CATEGORY_TREE = [
  {
    id: "cat-1",
    name: "Áo",
    children: [
      { id: "cat-1-1", name: "Áo sơ mi", children: [] },
      { id: "cat-1-2", name: "Áo thun", children: [] },
      { id: "cat-1-3", name: "Áo khoác", children: [] },
      { id: "cat-1-4", name: "Áo vest / Blazer", children: [] },
    ],
  },
  {
    id: "cat-2",
    name: "Quần",
    children: [
      { id: "cat-2-1", name: "Quần tây", children: [] },
      { id: "cat-2-2", name: "Quần jeans", children: [] },
      { id: "cat-2-3", name: "Quần short", children: [] },
    ],
  },
  {
    id: "cat-3",
    name: "Phụ kiện",
    children: [
      { id: "cat-3-1", name: "Thắt lưng", children: [] },
      { id: "cat-3-2", name: "Túi xách", children: [] },
      { id: "cat-3-3", name: "Mũ / Nón", children: [] },
    ],
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
export const STATUS_OPTIONS = [
  { value: "active", label: "Đang bán" },
  { value: "draft", label: "Nháp" },
  { value: "inactive", label: "Ẩn" },
];

export const uid = () => Math.random().toString(36).slice(2, 9);

export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
