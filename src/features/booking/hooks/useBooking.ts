import { useQuery, useMutation } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import { Booking } from "../types/booking.types";

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => bookingService.getServices(),
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => bookingService.getStaff(),
  });
}

export function useAvailableSlots(date: string, serviceId: string, staffId?: string) {
  return useQuery({
    queryKey: ['available-slots', date, serviceId, staffId],
    queryFn: () => bookingService.getAvailableSlots(date, serviceId, staffId),
    enabled: !!date && !!serviceId,
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (newBooking: Omit<Booking, 'id' | 'status' | 'created_at'>) => 
      bookingService.createBooking(newBooking),
  });
}
