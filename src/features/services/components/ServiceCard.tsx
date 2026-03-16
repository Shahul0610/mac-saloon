"use client";

import Image from "next/image";
import { useState } from "react";
import { Service } from "../types/service.types";
import { Button } from "@/shared/components/Button";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imgSrc, setImgSrc] = useState(service.image_url || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80");

  return (
    <div className="group relative overflow-hidden bg-card border border-border interactive-card cursor-pointer">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80")}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
      </div>
      
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-heading font-semibold uppercase tracking-widest">{service.name}</h3>
          <span className="text-sm font-light text-muted-foreground">₹{service.price}</span>
        </div>
        
        <p className="text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-4">
          <span className="text-xs uppercase tracking-[0.2em] font-light italic">{service.duration} MIN</span>
          <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
