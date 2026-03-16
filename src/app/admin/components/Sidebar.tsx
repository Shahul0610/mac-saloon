"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  ChartLine, 
  LogOut,
  Settings,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Staff", href: "/admin/staff", icon: Users },
  { name: "Services", href: "/admin/services", icon: Scissors },
  { name: "Sales", href: "/admin/sales", icon: ChartLine },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background text-foreground h-screen fixed left-0 top-0 border-r border-border flex flex-col">
      <div className="p-8 border-b border-border">
        <Link href="/" className="text-xl font-heading font-bold tracking-[0.2em] uppercase">
          MAC ADMIN
        </Link>
      </div>

      <nav className="flex-grow p-4 mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-sm uppercase tracking-widest font-light transition-all rounded-none",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center space-x-3 px-4 py-3 text-sm uppercase tracking-widest font-light hover:text-gray-400 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
