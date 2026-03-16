"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

const categories = ["All", "Haircut", "Color", "Beard", "Interior"];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80", category: "Beard" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80", category: "Haircut" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80", category: "Haircut" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80", category: "Interior" },
  { src: "https://images.unsplash.com/photo-1593702275677-f916c8c9fa41?auto=format&fit=crop&q=80", category: "Beard" },
  { src: "https://images.unsplash.com/photo-1516714435131-44d6b64dc392?auto=format&fit=crop&q=80", category: "Interior" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Portfolio</h1>
          <p className="text-4xl md:text-6xl font-heading font-medium tracking-tight">CRAFT & PRECISION</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-[10px] md:text-xs uppercase tracking-[0.4em] transition-all duration-300 relative pb-2",
                activeCategory === cat ? "text-foreground border-b border-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => (
            <motion.div
              layout
              key={img.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square overflow-hidden group"
            >
              <Image
                src={img.src}
                alt="Salon Work"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-[10px] uppercase tracking-[0.4em] font-light border border-white px-6 py-2">
                  {img.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
