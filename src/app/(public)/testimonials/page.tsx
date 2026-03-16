"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "James Wilson",
    role: "Regular Customer",
    comment: "The precision and attention to detail at MAC Beauty Salon is unmatched. Best haircut I've had in years. The atmosphere is calm and professional.",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    name: "Alexander Reed",
    role: "Business Executive",
    comment: "A truly premium experience. The atmosphere is sophisticated and the service is professional. I always leave feeling confident.",
    rating: 5,
    date: "1 month ago"
  },
  {
    name: "Thomas Morgan",
    role: "Local Artist",
    comment: "Found my go-to spot. They really understand hair and how to shape it perfectly for my face. Highly recommended for creative styles.",
    rating: 5,
    date: "2 months ago"
  },
  {
    name: "David Chen",
    role: "Tech Professional",
    comment: "Exceptional beard grooming. The hot towel treatment is a must-try. Very consistent quality every time I visit.",
    rating: 5,
    date: "3 months ago"
  },
  {
    name: "Michael Scott",
    role: "Manager",
    comment: "The staff is incredibly talented. They take their time to get it right. It's not just a haircut, it's an experience.",
    rating: 4,
    date: "3 months ago"
  },
  {
    name: "Robert Evans",
    role: "Architect",
    comment: "Minimalist design and maximalist service. Exactly what I look for in a grooming salon. 5 stars all the way.",
    rating: 5,
    date: "4 months ago"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Testimonials</h1>
          <p className="text-4xl md:text-6xl font-heading font-medium tracking-tight">VOICES OF EXPERIENCE</p>
          <p className="max-w-xl mx-auto text-muted-foreground font-light leading-relaxed">
            Discover why our clients trust MAC Beauty Salon for their grooming needs. Real reviews from our valued community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-10 border border-border flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < t.rating ? "fill-foreground text-transparent" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.date}</span>
                </div>
                <p className="text-lg font-light leading-relaxed italic text-foreground">
                  "{t.comment}"
                </p>
              </div>
              <div className="pt-10 border-t border-border/50 mt-10">
                <p className="text-xs font-bold uppercase tracking-widest">{t.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-light">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card border border-border p-16 md:p-24 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-foreground uppercase">EXPERIENCED THE MAGIC?</h2>
          <p className="max-w-md mx-auto text-muted-foreground font-light text-sm uppercase tracking-[0.2em]">
            We'd love to hear about your transformation. Share your feedback with us.
          </p>
          <button className="text-xs uppercase tracking-[0.4em] border-b border-foreground pb-2 hover:text-muted-foreground transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}
