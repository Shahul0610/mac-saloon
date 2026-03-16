import { BookingForm } from "@/features/booking/components/BookingForm";

export default function BookingPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Reservation</h1>
          <p className="text-4xl md:text-6xl font-heading font-medium tracking-tight">BOOK YOUR SLOT</p>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
