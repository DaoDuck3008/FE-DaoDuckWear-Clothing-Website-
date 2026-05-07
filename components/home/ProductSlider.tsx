"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
  isNew?: boolean;
  outOfStock?: boolean;
  slug?: string;
}

const VISIBLE_LG = 4;
const VISIBLE_SM = 2;
const VISIBLE_XS = 1;
const INTERVAL_MS = 3000;
const TRANSITION_MS = 500;

export const ProductSliderCard = ({ product }: { product: Product }) => {
  const href = product.slug ? `/products/${product.slug}` : "#";
  return (
    <Link href={href} className="group/card block px-2 lg:px-3">
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
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center absolute inset-0 transition-transform duration-700 group-hover/card:scale-105"
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
    </Link>
  );
};

interface ProductSliderSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export const ProductSliderSection = ({
  title,
  products,
  viewAllHref = "#",
}: ProductSliderSectionProps) => {
  const n = products.length;

  // Clone VISIBLE_LG items at both ends for seamless infinite loop
  const extended = [
    ...products.slice(-VISIBLE_LG),   // start clones (for backward wrap)
    ...products,                        // real items
    ...products.slice(0, VISIBLE_LG),  // end clones (for forward wrap)
  ];

  // currentIndex starts at VISIBLE_LG so we begin on the first real item
  const [currentIndex, setCurrentIndex] = useState(VISIBLE_LG);
  const [animated, setAnimated] = useState(true);
  const [itemWidth, setItemWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Measure item width from DOM based on current viewport
  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const visible =
      window.innerWidth >= 1024
        ? VISIBLE_LG
        : window.innerWidth >= 640
          ? VISIBLE_SM
          : VISIBLE_XS;
    setItemWidth(w / visible);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Re-enable animation one frame after a silent (no-animation) index reset
  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      );
      return () => cancelAnimationFrame(id);
    }
  }, [animated]);

  // After each transition ends, silently jump to the mirror real position if we
  // landed in the clone zone (keeps the loop seamless)
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (currentIndex >= VISIBLE_LG + n) {
      setAnimated(false);
      setCurrentIndex((i) => i - n);
    } else if (currentIndex < VISIBLE_LG) {
      setAnimated(false);
      setCurrentIndex((i) => i + n);
    }
  };

  const next = useCallback(() => setCurrentIndex((i) => i + 1), []);
  const prev = useCallback(() => setCurrentIndex((i) => i - 1), []);

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, INTERVAL_MS);
  }, [next]);

  const stopAuto = useCallback(() => clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (n > 0) startAuto();
    return stopAuto;
  }, [n, startAuto, stopAuto]);

  if (!n) return null;

  // 0-based real index for dot indicator
  const realIndex = ((currentIndex - VISIBLE_LG) % n + n) % n;

  return (
    <section className="max-w-[1920px] mx-auto px-6 lg:px-12 py-8 lg:py-12 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tighter uppercase">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => { prev(); startAuto(); }}
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
            className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center hover:border-black hover:bg-stone-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { next(); startAuto(); }}
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
            className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center hover:border-black hover:bg-stone-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div
          className="flex"
          style={{
            transform: itemWidth
              ? `translateX(-${currentIndex * itemWidth}px)`
              : undefined,
            transition:
              animated && itemWidth
                ? `transform ${TRANSITION_MS}ms ease-in-out`
                : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              style={itemWidth ? { width: `${itemWidth}px`, flexShrink: 0 } : undefined}
              className={itemWidth ? "" : "w-full sm:w-1/2 lg:w-1/4 flex-shrink-0"}
            >
              <ProductSliderCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-8">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAnimated(true);
              setCurrentIndex(VISIBLE_LG + i);
              startAuto();
            }}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              realIndex === i ? "bg-black" : "bg-stone-300"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* View all */}
      <div className="mt-8 border-b border-stone-200 pb-12">
        <a
          href={viewAllHref}
          className="inline-block border border-stone-300 px-6 py-2 text-[11px] font-medium uppercase tracking-widest hover:border-black transition-colors"
        >
          Xem tất cả
        </a>
      </div>
    </section>
  );
};
