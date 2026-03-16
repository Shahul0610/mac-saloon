"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon, Clock, User } from "lucide-react";

import { Button } from "@/shared/components/Button";
import { cn } from "@/shared/utils/cn";
import { useServices, useAvailableSlots, useCreateBooking } from "../hooks/useBooking";

const bookingSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  booking_date: z.date({ message: "Please select a date" } as any),
  booking_time: z.string().min(1, "Please select a time"),
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_phone: z.string().min(10, "Phone must be at least 10 digits"),
  customer_email: z.string().email().optional().or(z.literal("")),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [step, setStep] = useState(1);
  const { data: services, isLoading: servicesLoading } = useServices();
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service_id: "",
      booking_time: "",
      customer_name: "",
      customer_phone: "",
      customer_email: "",
    },
  });

  const watchServiceId = form.watch("service_id");
  const watchDate = form.watch("booking_date");
  const watchTime = form.watch("booking_time");

  const formattedDate = watchDate ? format(watchDate, "yyyy-MM-dd") : "";
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots(formattedDate, watchServiceId);

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking.mutateAsync({
        ...data,
        booking_date: format(data.booking_date, "yyyy-MM-dd"),
      });
      setStep(5); // Success step
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const selectedService = services?.find(s => s.id === watchServiceId);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-4xl mx-auto bg-card border border-border min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="h-1 bg-muted">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
          />
        </div>
      )}

      <div className="p-8 md:p-12 flex-grow">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-heading uppercase tracking-widest">Select Service</h2>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-light">Choose your transformation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services?.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      form.setValue("service_id", service.id);
                      nextStep();
                    }}
                    className={cn(
                      "p-6 text-left border border-border transition-all duration-300 group hover:border-primary",
                      watchServiceId === service.id ? "bg-primary text-primary-foreground" : "bg-transparent"
                    )}
                  >
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-heading tracking-widest uppercase">{service.name}</span>
                      <span className="text-xs opacity-60">₹{service.price}</span>
                    </div>
                  </button>
                ))}
                {servicesLoading && <div className="col-span-2 py-20 text-center animate-pulse uppercase tracking-[0.2em] font-light">Loading Services...</div>}
                {!servicesLoading && (!services || services.length === 0) && (
                   <div className="col-span-2 py-20 text-center uppercase tracking-[0.2em] font-light text-muted-foreground">
                     No services available. Please check back later.
                   </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-heading uppercase tracking-widest">Select Date & Time</h2>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-light">Find your slot</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={watchDate}
                    onSelect={(d) => d && form.setValue("booking_date", d)}
                    disabled={{ before: new Date() }}
                    className="border-none"
                    modifiersStyles={{
                      selected: { 
                        backgroundColor: 'white', 
                        color: 'black',
                        borderRadius: '0px'
                      },
                      disabled: {
                        opacity: 0.2,
                        textDecoration: 'line-through'
                      }
                    }}
                    styles={{
                      head_cell: {
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em'
                      },
                      day: {
                        fontSize: '12px',
                        fontWeight: '300'
                      }
                    }}
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Available Slots</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {slots?.map((slot: { time: string, isAvailable: boolean }, index: number) => (
                      <button
                        key={`${slot.time}-${index}`}
                        disabled={!slot.isAvailable}
                        onClick={() => form.setValue("booking_time", slot.time)}
                        className={cn(
                          "py-3 text-sm border border-border transition-all uppercase tracking-widest relative",
                          watchTime === slot.time ? "bg-foreground text-background" : "hover:border-primary",
                          !slot.isAvailable && "opacity-20 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        <span className={cn(!slot.isAvailable && "line-through")}>
                          {slot.time}
                        </span>
                      </button>
                    ))}
                    {slotsLoading && <div key="loading" className="col-span-3 py-10 text-center animate-pulse uppercase tracking-[0.2em] font-light">Checking Availability...</div>}
                    {!slotsLoading && watchDate && Array.isArray(slots) && slots.length === 0 && (
                       <div key="booked" className="col-span-3 py-10 text-center text-xs uppercase tracking-widest text-muted-foreground">
                         Fully Booked
                       </div>
                    )}
                    {!slotsLoading && watchDate && slots === undefined && (
                       <div key="error" className="col-span-3 py-10 text-center text-xs uppercase tracking-widest text-red-500/60">
                         Unable to load slots
                       </div>
                    )}
                    {!watchDate && (
                      <div key="select-date" className="col-span-3 py-10 text-center text-xs uppercase tracking-widest text-muted-foreground">
                        Select a date first
                      </div>
                    )}
                  </div>
                  
                  {watchTime && (
                    <Button onClick={nextStep} className="w-full">
                      Continue to Details <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <button onClick={prevStep} className="flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="mr-1 w-4 h-4" /> Back to Services
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-heading uppercase tracking-widest">Your Details</h2>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-light">Finish the reservation</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                  <input
                    {...form.register("customer_name")}
                    placeholder="John Doe"
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                  {form.formState.errors.customer_name && (
                    <p className="text-[10px] text-red-500 uppercase tracking-widest">{form.formState.errors.customer_name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Phone Number</label>
                  <input
                    {...form.register("customer_phone")}
                    placeholder="+1 234 567 890"
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                  {form.formState.errors.customer_phone && (
                    <p className="text-[10px] text-red-500 uppercase tracking-widest">{form.formState.errors.customer_phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold">Email Address (Optional)</label>
                  <input
                    {...form.register("customer_email")}
                    placeholder="john@example.com"
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <Button 
                  onClick={nextStep} 
                  className="w-full mt-8"
                  disabled={!form.formState.isValid}
                >
                  Review Booking <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <button onClick={prevStep} className="flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mx-auto">
                <ChevronLeft className="mr-1 w-4 h-4" /> Back to Time
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto space-y-8"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-heading uppercase tracking-widest">Review</h2>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-light">Confirm your appointment</p>
              </div>

              <div className="p-8 border border-border space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Service</span>
                  </div>
                  <span className="text-sm uppercase tracking-widest">{selectedService?.name}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Date</span>
                  </div>
                  <span className="text-sm uppercase tracking-widest">{formattedDate}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Time</span>
                  </div>
                  <span className="text-sm uppercase tracking-widest">{watchTime}</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Client</span>
                  </div>
                  <span className="text-sm uppercase tracking-widest">{form.getValues("customer_name")}</span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total Price</span>
                  <span className="text-xl font-heading font-bold">₹{selectedService?.price}</span>
                </div>
              </div>

              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                className="w-full"
                isLoading={createBooking.isPending}
              >
                Confirm Booking
              </Button>

              <button onClick={prevStep} className="flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mx-auto">
                <ChevronLeft className="mr-1 w-4 h-4" /> Back to Details
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 space-y-8"
            >
              <div className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center mx-auto">
                <Check className="text-background w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-heading uppercase tracking-widest">RESERVATION SECURED</h2>
                <p className="text-gray-500 font-light max-w-sm mx-auto">
                  Your appointment at MAC Beauty Salon has been confirmed. We look forward to seeing you.
                </p>
              </div>
              <Button variant="luxury" onClick={() => window.location.href = "/"}>
                Return Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
