"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Check, X, Clock, Calendar as CalendarIcon, User, Phone } from "lucide-react";
import { Button } from "@/shared/components/Button";

export default function AdminBookings() {
  const queryClient = useQueryClient();

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, price)
        `)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      alert("Failed to update booking: " + error.message);
    }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Management</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">BOOKING LOGS</p>
        </div>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold">Client</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold">Service</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold">Date & Time</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking: any) => (
              <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium uppercase tracking-widest">{booking.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center">
                      <Phone className="w-2.5 h-2.5 mr-1" /> {booking.customer_phone}
                    </p>
                  </div>
                </td>
                <td className="p-6 text-sm uppercase tracking-widest">
                  {booking.services?.name}
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="text-sm flex items-center font-light uppercase tracking-widest">
                      <CalendarIcon className="w-3 h-3 mr-2" /> {booking.booking_date}
                    </p>
                    <p className="text-xs flex items-center text-muted-foreground uppercase tracking-widest">
                      <Clock className="w-3 h-3 mr-2" /> {booking.booking_time}
                    </p>
                  </div>
                </td>
                <td className="p-6">
                  <span className={clsx(
                    "text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold rounded-none",
                    booking.status === 'approved' ? "bg-green-500/20 text-green-400" :
                    booking.status === 'pending' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end space-x-2">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus.mutate({ id: booking.id, status: 'approved' })}
                        className="p-2 border border-border hover:bg-foreground hover:text-background transition-all duration-300"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus.mutate({ id: booking.id, status: 'cancelled' })}
                      className="p-2 border border-border hover:bg-red-600 hover:text-white transition-all duration-300"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-20 text-center animate-pulse uppercase tracking-[0.3em] font-light">
                  Retrieving Bookings...
                </td>
              </tr>
            )}
            {!isLoading && (!bookings || bookings.length === 0) && (
              <tr>
                <td colSpan={5} className="p-20 text-center uppercase tracking-[0.3em] font-light text-muted-foreground">
                  {bookings === null ? "Error loading bookings" : "No bookings found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple helper duplicated here because I forgot to import it if I put it in common
function clsx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
