"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";

const mockMonthlyData = [
  { month: "Jan", sales: 4200, bookings: 120 },
  { month: "Feb", sales: 3800, bookings: 110 },
  { month: "Mar", sales: 5100, bookings: 145 },
  { month: "Apr", sales: 4800, bookings: 130 },
  { month: "May", sales: 6200, bookings: 160 },
  { month: "Jun", sales: 5800, bookings: 150 },
];

export default function SalesManagement() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Finance</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">SALES ANALYTICS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "$24,500", icon: DollarSign, trend: "+12%" },
          { label: "Monthly Growth", value: "18.5%", icon: TrendingUp, trend: "+2.4%" },
          { label: "Product Sales", value: "$3,200", icon: ShoppingBag, trend: "+5%" },
          { label: "Card Payments", value: "82%", icon: CreditCard, trend: "Stable" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-8 space-y-4">
            <div className="p-2 border border-border w-fit">
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-heading font-light tracking-tight">{stat.value}</p>
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">{stat.label}</p>
                <span className="text-[8px] font-bold text-green-500 uppercase pt-1">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-8 space-y-8">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Revenue Trend (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMonthlyData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#737373", letterSpacing: "0.2em" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#737373" }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "0", color: "#fff" }}
                  labelStyle={{ borderBottom: "1px solid #333", marginBottom: "8px", paddingBottom: "4px" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#fff" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border p-8 space-y-8">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Appointments Volume</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#737373", letterSpacing: "0.2em" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#737373" }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "0", color: "#fff" }}
                />
                <Bar dataKey="bookings" fill="#fff" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
