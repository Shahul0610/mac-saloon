export interface Booking {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: string;
  staff_id?: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  total_amount?: number;
  notes?: string;
  created_at?: string;
}

export interface BookingFormData {
  service_id: string;
  staff_id?: string;
  booking_date: Date;
  booking_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
}

export interface TimeSlot {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_blocked: boolean;
}
