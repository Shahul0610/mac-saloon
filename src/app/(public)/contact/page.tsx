"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/Button";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onChange"
  });

  const onSubmit = (data: InquiryFormValues) => {
    console.log("Inquiry submitted:", data);
    // Submit to Supabase
    reset();
    alert("Inquiry sent successfully. We will contact you soon.");
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-4">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Get in touch</h1>
          <p className="text-4xl md:text-6xl font-heading font-medium tracking-tight">CONNECT WITH US</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-heading uppercase tracking-widest">Our Location</h2>
              <div className="flex items-start space-x-4 pt-4">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="space-y-1 text-sm font-light leading-relaxed">
                  <p>MAC Beauty Salon Headquarters</p>
                  <p>123 Luxury Avenue, Metropolis, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-heading uppercase tracking-widest">Contact Details</h2>
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-light">+1 (234) 567-890</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-light">info@macbeautysalon.com</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-heading uppercase tracking-widest">Social Presence</h2>
              <div className="flex space-x-8 pt-4">
                <Instagram className="w-5 h-5 hover:text-muted-foreground transition-colors cursor-pointer" />
                <Facebook className="w-5 h-5 hover:text-muted-foreground transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-muted-foreground transition-colors cursor-pointer" />
              </div>
            </div>
            
            <div className="h-[300px] w-full bg-muted border border-border flex items-center justify-center grayscale">
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Interactive map placeholder</span>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-card border border-border p-12 space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading uppercase tracking-widest">Direct Enquiry</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-light">We value your communication</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Full Name</label>
                <input
                  {...register("name")}
                  className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.name && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Phone Number</label>
                <input
                  {...register("phone")}
                  className="w-full bg-transparent border-b border-border py-4 focus:outline-none focus:border-primary transition-colors"
                />
                {errors.phone && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Your Message</label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className="w-full bg-transparent border border-border p-4 focus:outline-none focus:border-primary transition-colors resize-none"
                />
                {errors.message && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.message.message}</p>}
              </div>

              <Button type="submit" variant="luxury" className="w-full" disabled={!isValid}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
