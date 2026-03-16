"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, Users, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react";

const supabase = createClient();

export default function AdminDashboard() {
  // Fetch overview stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-overview-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [bookings, sales, customers] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact' }).eq('booking_date', today),
        supabase.from('sales').select('amount'),
        supabase.from('bookings').select('customer_name', { count: 'exact' }) // Rough proxy for customers
      ]);

      const totalRevenue = sales.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      return {
        todayBookings: bookings.count || 0,
        revenue: totalRevenue,
        customers: customers.count || 0
      };
    }
  });

  // Fetch upcoming bookings
  const { data: upcoming, isLoading: upcomingLoading } = useQuery({
    queryKey: ['admin-overview-upcoming'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('bookings')
        .select('*, services(name)')
        .gte('booking_date', today)
        .eq('status', 'approved')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true })
        .limit(5);
      return data;
    }
  });

  const stats = [
    { label: "Today's Bookings", value: statsData?.todayBookings.toString() || "0", icon: Calendar, change: "Live", color: "blue" },
    { label: "Total Revenue", value: `$${statsData?.revenue.toLocaleString() || "0"}`, icon: DollarSign, change: "All Time", color: "green" },
    { label: "Total Clients", value: statsData?.customers.toString() || "0", icon: Users, change: "Database", color: "purple" },
    { label: "Active Services", value: "8", icon: TrendingUp, change: "Active", color: "orange" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Console</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">DASHBOARD OVERVIEW</p>
        </div>
        <div className="text-sm uppercase tracking-widest font-light text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 border border-border">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 tracking-widest leading-none">
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-heading font-light tracking-tight">
                {statsLoading ? "..." : stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border p-8 h-[400px] flex items-center justify-center">
           <div className="text-center space-y-4">
              <TrendingUp className="w-8 h-8 mx-auto text-muted-foreground opacity-20" />
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Growth analytics syncing...</p>
           </div>
        </div>
        <div className="bg-card border border-border p-8 space-y-8">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold flex items-center">
            <Clock className="w-3.5 h-3.5 mr-2" /> Upcoming Schedule
          </h3>
          <div className="space-y-6">
            {upcoming?.map((booking) => (
              <div key={booking.id} className="flex items-start justify-between py-2 border-b border-border last:border-0 group cursor-pointer hover:border-primary transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">{booking.customer_name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-light">
                    {(booking.services as any)?.name} • {booking.booking_time}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
            {upcomingLoading && <div className="text-center py-10 animate-pulse uppercase tracking-widest text-[10px]">Loading Schedule...</div>}
            {!upcomingLoading && upcoming?.length === 0 && (
              <div className="text-center py-10 text-[10px] uppercase tracking-widest text-muted-foreground italic">
                No confirmed appointments today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

