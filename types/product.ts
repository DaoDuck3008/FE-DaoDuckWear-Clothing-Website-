export type CategoryNode = { id: string; name: string; children: CategoryNode[] };

export type Variant = {
  id: string;
  size: string;
  color: string;
  price: string;
  sku: string;
  stock: string;
};

export type MainImage = { file: File; preview: string };
