import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background text-foreground pt-20 pb-10 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img 
              src="/logo-mascot.png" 
              alt="MAC Logo" 
              className="w-14 h-14 object-contain mix-blend-screen" 
            />
            <h3 className="text-xl font-heading font-bold tracking-[0.2em] uppercase">MAC BEAUTY SALON</h3>
          </div>
          <p className="text-muted-foreground font-light leading-relaxed">
            Elevating the art of grooming with luxury services and a team of professional stylists.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link></li>
            <li><Link href="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">Gallery</Link></li>
            <li><Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Information</h4>
          <ul className="space-y-4">
            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link href="/booking" className="text-muted-foreground hover:text-foreground transition-colors">Book Online</Link></li>
            <li><Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Staff Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-muted-foreground font-light">
            <li>123 Luxury Avenue, Metropolis</li>
            <li>+1 (234) 567-890</li>
            <li>info@macbeautysalon.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border text-center text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
        &copy; {new Date().getFullYear()} MAC BEAUTY SALON. All rights reserved.
      </div>
    </footer>
  );
}
