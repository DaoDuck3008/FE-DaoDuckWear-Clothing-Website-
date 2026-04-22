export type CategoryNode = { id: string; name: string; children: CategoryNode[] };

export type Variant = {
  id: string;
  size: string;
  color: string;
  price: number | string;
  sku: string;
  stock: number | string;
  inventory?: {
    quantity: number;
  };
};

export type ProductImage = {
  id: string;
  url: string;
  color?: string;
  isMain: boolean;
  isThumbnail: boolean;
};

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category?: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  variants: Variant[];
}

export type MainImage = { file: File; preview: string };
