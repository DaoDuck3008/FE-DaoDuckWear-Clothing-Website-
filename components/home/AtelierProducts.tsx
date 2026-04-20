"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
  isNew?: boolean;
  outOfStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const AtelierProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group/card cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-stone-100">
        {product.isNew && (
          <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 z-10">
            NEW
          </span>
        )}
        {product.outOfStock && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 z-10">
            Hết hàng
          </span>
        )}
        <img
          alt={product.name}
          className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 group-hover/card:scale-105"
          src={product.image}
        />
      </div>
      <div>
        <h3 className="font-sans text-sm font-medium mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex gap-2 items-center">
          <span className="font-sans text-sm font-medium text-black">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="font-sans text-xs text-stone-400 line-through">
              {product.oldPrice}
            </span>
          )}
          {product.discount && (
            <span className="font-sans text-[10px] bg-black text-white px-1 py-0.5 font-medium">
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface AtelierProductSectionProps {
  title: string;
  products: Product[];
}

export const AtelierProductSection = ({ title, products }: AtelierProductSectionProps) => {
  return (
    <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16 lg:py-24 mb-12">
      <h2 className="font-serif text-2xl font-bold tracking-tighter uppercase mb-8">
        {title}
      </h2>
      <div className="relative group">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-stone-50 transition-colors opacity-0 group-hover:opacity-100 hidden lg:flex">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <AtelierProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-stone-50 transition-colors opacity-0 group-hover:opacity-100 hidden lg:flex">
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Dots - visual only as per code.html */}
        <div className="flex justify-center gap-1.5 mt-8">
          <button className="w-1.5 h-1.5 rounded-full bg-stone-300"></button>
          <button className="w-1.5 h-1.5 rounded-full bg-stone-300"></button>
          <button className="w-1.5 h-1.5 rounded-full bg-stone-300"></button>
          <button className="w-1.5 h-1.5 rounded-full bg-black"></button>
        </div>
      </div>
      
      <div className="mt-8 border-b border-stone-200 pb-12">
        <a
          className="inline-block border border-stone-300 px-6 py-2 text-[11px] font-medium uppercase tracking-widest hover:border-black transition-colors"
          href="#"
        >
          Xem tất cả
        </a>
      </div>
    </section>
  );
};
