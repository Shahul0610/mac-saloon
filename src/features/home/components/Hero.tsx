"use client";

import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Image with Parallax or just simple styling */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-1" />

      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="flex justify-center mb-8"
        >
          <img 
            src="/logo-mascot.png" 
            alt="MAC Logo" 
            className="w-48 h-48 object-contain mix-blend-screen" 
          />
        </motion.div>
        
        <h1 className="text-4xl md:text-7xl font-heading font-light tracking-[0.3em] uppercase leading-tight">
          MAC <span className="font-bold text-white">BEAUTY</span> SALON
        </h1>
        <p className="text-lg md:text-xl font-light tracking-[0.2em] uppercase text-gray-300">
          Premium Grooming Experience
        </p>
        <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/booking">
            <Button variant="luxury" size="lg" className="w-full md:w-auto">
              Reserve Now
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              View Services
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
