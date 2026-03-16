"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomDialog } from "@/shared/components/CustomDialog";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const supabase = createClient();

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [salonIdentity, setSalonIdentity] = useState({ name: "", email: "" });
  const [socialLinks, setSocialLinks] = useState({ instagram: "", twitter: "", whatsapp: "" });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean} & any>({ isOpen: false });

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('salon_settings').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Sync state with fetched data
  useEffect(() => {
    if (settings) {
      const wh = settings.find(s => s.key === 'working_hours')?.value as any[];
      const si = settings.find(s => s.key === 'salon_identity')?.value as { name: string, email: string };
      const sl = settings.find(s => s.key === 'social_links')?.value as { instagram: string, twitter: string, whatsapp: string };
      if (wh) setWorkingHours(wh);
      if (si) setSalonIdentity(si);
      if (sl) setSocialLinks(sl);
    }
  }, [settings]);

  // Save mutation
  const saveSettings = useMutation({
    mutationFn: async () => {
      const updates = [
        supabase.from('salon_settings').update({ value: workingHours }).eq('key', 'working_hours'),
        supabase.from('salon_settings').update({ value: salonIdentity }).eq('key', 'salon_identity'),
        supabase.from('salon_settings').update({ value: socialLinks }).eq('key', 'social_links')
      ];
      const results = await Promise.all(updates);
      const firstError = results.find(r => r.error);
      if (firstError?.error) throw firstError.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setDialogConfig({
        isOpen: true,
        title: "Settings Saved",
        message: "Your salon configurations have been synchronised with the cloud successfully.",
        type: "success"
      });
    }
  });

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};
    if (salonIdentity.name.trim().length < 3) newErrors.name = "Salon Name must be at least 3 characters";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(salonIdentity.email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      saveSettings.mutate();
    }
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', val: string) => {
    const newHours = [...workingHours];
    newHours[index][field] = val;
    setWorkingHours(newHours);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="uppercase tracking-[0.4em] text-xs font-light">Loading System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">System</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">SALON SETTINGS</p>
        </div>
        <Button variant="luxury" size="sm" onClick={validateAndSave} isLoading={saveSettings.isPending}>
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Working Hours */}
        <div className="bg-card border border-border p-10 space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading uppercase tracking-widest flex items-center">
              <Clock className="w-5 h-5 mr-3" /> Working Hours
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Set shop opening and closing times</p>
          </div>

          <div className="space-y-4">
            {workingHours.map((wh, i) => (
              <div key={wh.day} className="flex items-center justify-between py-4 border-b border-border last:border-0 group">
                <div className="flex items-center space-x-6">
                  <span className="w-24 text-xs font-bold uppercase tracking-widest">{wh.day}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={wh.isOpen} 
                      className="sr-only peer"
                      onChange={() => {
                        const newHours = [...workingHours];
                        newHours[i].isOpen = !newHours[i].isOpen;
                        setWorkingHours(newHours);
                      }}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className={`flex items-center space-x-4 transition-opacity ${wh.isOpen ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <input 
                    type="time" 
                    value={wh.start} 
                    onChange={(e) => handleTimeChange(i, 'start', e.target.value)}
                    className="bg-card border border-border px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">to</span>
                  <input 
                    type="time" 
                    value={wh.end} 
                    onChange={(e) => handleTimeChange(i, 'end', e.target.value)}
                    className="bg-card border border-border px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-8">
          <div className="bg-card border border-border p-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading uppercase tracking-widest flex items-center">
                <Plus className="w-5 h-5 mr-3" /> Social Presence
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Connect with your clients online</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Instagram URL</label>
                <input 
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-sm font-light focus:outline-none focus:border-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">WhatsApp Number</label>
                <input 
                  value={socialLinks.whatsapp}
                  onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-sm font-light focus:outline-none focus:border-primary" 
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading uppercase tracking-widest">Salon Identity</h2>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Public information and branding</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Salon Name</label>
                <input 
                  value={salonIdentity.name} 
                  onChange={(e) => {
                    setSalonIdentity({ ...salonIdentity, name: e.target.value });
                    if (errors.name) setErrors({...errors, name: ""});
                  }}
                  className={`w-full bg-transparent border-b py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.name ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.name && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Booking Notification Email</label>
                <input 
                  value={salonIdentity.email}
                  onChange={(e) => {
                    setSalonIdentity({ ...salonIdentity, email: e.target.value });
                    if (errors.email) setErrors({...errors, email: ""});
                  }}
                  className={`w-full bg-transparent border-b py-3 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.email && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomDialog 
        {...dialogConfig}
        onClose={() => setDialogConfig({ ...dialogConfig, isOpen: false })}
      />
    </div>
  );
}

