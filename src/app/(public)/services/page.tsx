import { ServicesSection } from "@/features/services/components/ServicesSection";
import { BookingCTA } from "@/features/home/components/BookingCTA";

export default function ServicesPage() {
  return (
    <div className="pt-32">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-20">
        <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Expertise</h1>
        <p className="text-4xl md:text-6xl font-heading font-medium tracking-tight">OUR SERVICES</p>
        <p className="max-w-2xl mx-auto text-muted-foreground font-light leading-relaxed">
          From classic cuts to modern styling, our master barbers and stylists provide a tailored experience that defines your personal style.
        </p>
      </div>
      
      <ServicesSection />
      
      <div className="py-20 px-6 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-heading uppercase tracking-widest">The Cut & Style</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Every haircut begins with a consultation to understand your preferences and facial structure. We include a relaxing hair wash and finishing styling with our premium signature products.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-heading uppercase tracking-widest">Shave & Beard</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Experience the ritual of a traditional hot towel shave or a precision beard sculpting. We use organic oils and cooling balms to ensure comfort and a sharp finish.
            </p>
          </div>
        </div>
      </div>

      <BookingCTA />
    </div>
  );
}
