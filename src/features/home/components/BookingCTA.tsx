import Link from "next/link";
import { Button } from "@/shared/components/Button";

export function BookingCTA() {
  return (
    <section className="py-40 bg-background text-foreground px-6 text-center border-t border-border">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="text-4xl md:text-7xl font-heading font-light tracking-tight leading-tight">
          READY FOR YOUR <br />
          <span className="font-bold italic">REVOLUTION?</span>
        </h2>
        <p className="text-lg md:text-xl font-light text-muted-foreground tracking-[0.1em] uppercase">
          Book your slot today and experience the pinnacle of grooming.
        </p>
        <div className="pt-6">
          <Link href="/booking">
            <Button variant="luxury" size="lg">
              Reserve Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
