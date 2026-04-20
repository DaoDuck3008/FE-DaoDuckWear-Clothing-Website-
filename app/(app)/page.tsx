import AtelierHero from "@/components/home/AtelierHero";
import { AtelierProductSection } from "@/components/home/AtelierProducts";
import AtelierNewsletter from "@/components/home/AtelierNewsletter";

const TROUSERS_COLLECTION = [
  {
    id: "t1",
    name: "Quần Tây Âu Nam Ống Rộng Cạp Cao",
    price: "199.000 đ",
    oldPrice: "320.000 đ",
    discount: "-38%",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: "t2",
    name: "Quần Tây Nam Điều Chỉnh Cạp - Smart",
    price: "199.000 đ",
    oldPrice: "320.000 đ",
    discount: "-38%",
    image:
      "https://images.unsplash.com/photo-1624372333458-39ec513f269a?q=80&w=1972&auto=format&fit=crop",
  },
  {
    id: "t3",
    name: "Quần Âu Nam Ống Rộng Lụa Cotton",
    price: "269.000 đ",
    oldPrice: "450.000 đ",
    discount: "-40%",
    image:
      "https://images.unsplash.com/photo-1506629082928-886ec184c6c9?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "t4",
    name: "Quần Tây Nam Suông Chiết Ly",
    price: "229.000 đ",
    oldPrice: "350.000 đ",
    discount: "-35%",
    image:
      "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1974&auto=format&fit=crop",
  },
];

const SHIRTS_COLLECTION = [
  {
    id: "s1",
    name: "Sơ Mi Linen Tay Ngắn - Linen Shirt",
    price: "229.000 đ",
    oldPrice: "250.000 đ",
    discount: "-8%",
    image:
      "https://images.unsplash.com/photo-1621072156002-e2fcc1039715?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "s2",
    name: "Sơ Mi Lụa Tay Ngắn - Short-sleeved",
    price: "199.000 đ",
    oldPrice: "250.000 đ",
    discount: "-20%",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: "s3",
    name: "Áo Sơ Mi Lụa Dài Tay Form Rộng",
    price: "189.000 đ",
    oldPrice: "280.000 đ",
    discount: "-32%",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "s4",
    name: "Áo Sơ Mi Nam Khuy Ấn - Basic Shirt",
    price: "189.000 đ",
    oldPrice: "280.000 đ",
    discount: "-32%",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2070&auto=format&fit=crop",
    outOfStock: true,
  },
];

const JACKETS_COLLECTION = [
  {
    id: "j1",
    name: "Blazer Sleek 2 Khuy",
    price: "500.000 đ",
    oldPrice: "800.000 đ",
    discount: "-38%",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    outOfStock: true,
  },
  {
    id: "j2",
    name: "Blazer Short Sleeved",
    price: "550.000 đ",
    oldPrice: "900.000 đ",
    discount: "-39%",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "j3",
    name: "Áo Khoác Jeans - Classic Denim",
    price: "359.000 đ",
    oldPrice: "500.000 đ",
    discount: "-28%",
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "j4",
    name: "Áo Măng Tô Vải Dạ Tweed",
    price: "499.000 đ",
    oldPrice: "1.200.000 đ",
    discount: "-58%",
    image:
      "https://images.unsplash.com/photo-1539533377285-bb41e5c4f39a?q=80&w=1974&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <AtelierHero />

      {/* Main Content */}
      <main className="flex flex-col">
        {/* Collection Sections */}
        <AtelierProductSection
          title="BỘ SƯU TẬP QUẦN ÂU"
          products={TROUSERS_COLLECTION}
        />
        <AtelierProductSection
          title="BỘ SƯU TẬP SƠ MI"
          products={SHIRTS_COLLECTION}
        />
        <AtelierProductSection
          title="BỘ SƯU TẬP ÁO KHOÁC"
          products={JACKETS_COLLECTION}
        />

        {/* Newsletter Section */}
        <AtelierNewsletter />
      </main>
    </div>
  );
}
