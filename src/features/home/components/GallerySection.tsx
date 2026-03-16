"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const galleryImages = [
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599351431247-f5793384798b?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512690196236-d5a86c6036bb?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1593702275677-f916c8c9fa41?auto=format&fit=crop&q=80",
];

export function GallerySection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">The Art of Grooming</h2>
          <p className="text-4xl md:text-5xl font-heading font-medium tracking-tight">OUR GALLERY</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] group overflow-hidden"
            >
              <Image
                src={src}
                alt={`Salon Work ${index + 1}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-foreground text-xs uppercase tracking-[0.3em] font-light border-b border-foreground pb-2">View Work</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
