import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Booking } from "../types/booking.types";

const supabase = createClient();

export const bookingService = {
  async getAvailableSlots(date: string, serviceId: string, staffId?: string) {
    const defaultSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
    ];
    
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const isToday = date === todayStr;
    const currentTime = format(new Date(), "HH:mm");

    const availableBasis = isToday 
      ? defaultSlots.filter(slot => slot > currentTime)
      : defaultSlots;
    
    try {
      // Fetch bookings for that date to filter out taken slots
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
        .eq('status', 'approved');

      if (error) {
        console.warn("Supabase query error for slots:", error.message);
        return defaultSlots.map(slot => ({
          time: slot,
          isAvailable: !isToday || slot > currentTime
        }));
      }

      const takenSlots = existingBookings?.map(b => b.booking_time.substring(0, 5)) || [];
      
      return defaultSlots.map(slot => ({
        time: slot,
        isAvailable: !takenSlots.includes(slot) && (!isToday || slot > currentTime)
      }));
    } catch (e) {
      console.error("Failed to fetch slots:", e);
      return defaultSlots.map(slot => ({
        time: slot,
        isAvailable: !isToday || slot > currentTime
      }));
    }
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'created_at'>) {
    try {
      // Attempt to save to Supabase
      console.log("Attempting booking insert:", { ...bookingData, status: 'pending' });
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          { 
            ...bookingData,
            // If it's a mock service, we might need to nullify the service_ref or staff_ref 
            // if we want the row to actually save in a strict schema, 
            // but for now let's just try the save.
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase booking error detail:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(error.message || "Failed to create booking");
      }
      return data;
    } catch (e: any) {
      console.error("Critical booking error:", e);
      throw e;
    }
  },

  async getServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error || !data || data.length === 0) {
        console.warn("Supabase services table is empty or error. Using mock data fallback.");
        return [
          {
            id: "1",
            name: "The Signature Cut",
            description: "Precision cutting and styling tailored to your face shape and personal style.",
            price: 500,
            duration: 45,
            category: "Grooming",
            image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"
          },
          {
            id: "2",
            name: "Luxury Beard Shaper",
            description: "Professional beard shaping, trimming, and hot towel treatment.",
            price: 350,
            duration: 30,
            category: "Grooming",
            image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80"
          },
          {
            id: "3",
            name: "The Royal Treatment",
            description: "The ultimate grooming package including haircut, beard styling, and facial.",
            price: 1200,
            duration: 90,
            category: "Package",
            image_url: "https://images.unsplash.com/photo-1599351431247-f5793384798b?auto=format&fit=crop&q=80"
          }
        ];
      }
      return data;
    } catch (e) {
      console.error("Failed to fetch services:", e);
      return [
        {
          id: "1",
          name: "The Signature Cut",
          description: "Precision cutting and styling tailored to your face shape and personal style.",
          price: 500,
          duration: 45,
          category: "Grooming",
          image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"
        }
      ];
    }
  },

  async getStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }
};
