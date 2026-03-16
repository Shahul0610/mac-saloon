import { Hero } from "@/features/home/components/Hero";
import { ServicesSection } from "@/features/services/components/ServicesSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { GallerySection } from "@/features/home/components/GallerySection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { BookingCTA } from "@/features/home/components/BookingCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ServicesSection />
      <StatsSection />
      <GallerySection />
      <TestimonialsSection />
      <BookingCTA />
    </div>
  );
}
