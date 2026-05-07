import DAODUCKWEARHero from "@/components/home/HeroSection";
import {ProductSliderSection } from "@/components/home/ProductSlider";
import DAODUCKWEARNewsletter from "@/components/home/AtelierNewsletter";
import Link from "next/link";

interface ProductImage {
  url: string;
  isMain: boolean;
  color?: string;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  images: ProductImage[];
  createdAt: string;
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
}

function isNewProduct(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

function mapProduct(p: ApiProduct) {
  const mainImage =
    p.images?.find((img) => img.isMain)?.url || p.images?.[0]?.url || "";
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: formatPrice(p.basePrice),
    image: mainImage,
    isNew: isNewProduct(p.createdAt),
  };
}

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=5&sort=newest`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as ApiProduct[]).map(mapProduct);
  } catch {
    return [];
  }
}

async function getRootCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: ApiCategory[] = await res.json();
    return data.filter((c) => !c.parentId);
  } catch {
    return [];
  }
}

const SECTION_TITLES = [
  "SẢN PHẨM MỚI NHẤT",
  "BỘ SƯU TẬP NỔI BẬT",
  "GỢI Ý CHO BẠN",
];

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getRootCategories(),
  ]);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <DAODUCKWEARHero />

      {/* Main Content */}
      <main className="flex flex-col">

        {/* Product Sections */}
        {SECTION_TITLES.map((title) => (
          <ProductSliderSection
            key={title}
            title={title}
            products={products}
          />
        ))}

        {/* Newsletter Section */}
        <DAODUCKWEARNewsletter />
      </main>
    </div>
  );
}
