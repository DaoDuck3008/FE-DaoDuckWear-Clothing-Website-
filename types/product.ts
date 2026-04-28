export type CategoryNode = {
  id: string;
  name: string;
  children: CategoryNode[];
};

export type Variant = {
  id: string;
  size: string;
  color: string;
  colorHexId?: string;
  price: number | string;
  sku: string;
  image?: string;
  inventories?: {
    shopId: string;
    quantity: number;
    shop?: {
      name: string;
    };
  }[];
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
