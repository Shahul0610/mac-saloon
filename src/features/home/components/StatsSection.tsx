"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Happy Customers", value: "2.5K+" },
  { label: "Heads Chopped", value: "10K+" },
  { label: "Years Experience", value: "15" },
  { label: "Master Barbers", value: "8" },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-background text-foreground px-6 border-y border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="text-4xl md:text-6xl font-heading font-light tracking-tighter">
              {stat.value}
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-400 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
