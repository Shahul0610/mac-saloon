"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Regular Client",
    comment: "The best grooming experience I've ever had. MAC Beauty Salon is truly in a league of its own.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Business Professional",
    comment: "Professional, precise, and a great atmosphere. Highly recommend MAC Beauty Salon.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">What They Say</h2>
          <p className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-foreground">VOICES OF EXCELLENCE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-12 border border-border space-y-6 relative"
            >
              <div className="flex space-x-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-foreground text-transparent" />
                ))}
              </div>
              <p className="text-lg font-light leading-relaxed italic">"{t.comment}"</p>
              <div className="pt-6">
                <p className="text-sm font-bold uppercase tracking-widest">{t.name}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-light">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
