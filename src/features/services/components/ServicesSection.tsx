import { ServiceCard } from "./ServiceCard";
import { Service } from "../types/service.types";

const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Haircut",
    description: "Precision cutting and styling tailored to your face shape and personal style.",
    price: 500,
    duration: 45,
    category: "Grooming",
    image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Beard Styling",
    description: "Professional beard shaping, trimming, and hot towel treatment.",
    price: 350,
    duration: 30,
    category: "Grooming",
    image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Full Service",
    description: "The ultimate grooming package including haircut, beard styling, and facial.",
    price: 1200,
    duration: 90,
    category: "Package",
    image_url: "https://images.unsplash.com/photo-1512690196236-d5a86c6036bb?auto=format&fit=crop&q=80",
  }
];

export function ServicesSection() {
  return (
    <section className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Our Services</h2>
          <p className="text-4xl md:text-5xl font-heading font-medium tracking-tight">ELEVATED GROOMING</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {MOCK_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
