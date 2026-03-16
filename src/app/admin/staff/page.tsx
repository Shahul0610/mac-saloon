"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Mail, Phone, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useState } from "react";
import { X } from "lucide-react";
import { CustomDialog } from "@/shared/components/CustomDialog";

export default function StaffManagement() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, id?: string} & any>({ isOpen: false, title: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    image_url: "",
    is_active: true,
    bio: ""
  });

  // Fetch staff
  const { data: staff, isLoading } = useQuery({
    queryKey: ['admin-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('staff').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    }
  });

  const saveStaff = useMutation({
    mutationFn: async (data: any) => {
      if (editingStaff) {
        const { error } = await supabase
          .from('staff')
          .update(data)
          .eq('id', editingStaff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('staff')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
      setIsModalOpen(false);
      setEditingStaff(null);
    }
  });

  const handleEdit = (person: any) => {
    setEditingStaff(person);
    setFormData({
      name: person.name,
      role: person.role,
      email: person.email || "",
      phone: person.phone || "",
      image_url: person.image_url || "",
      is_active: person.is_active,
      bio: person.bio || ""
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      image_url: "",
      is_active: true,
      bio: ""
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Phone must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveStaff.mutate(formData);
    }
  };

  const confirmDelete = (id: string) => {
    setDialogConfig({
      isOpen: true,
      id,
      title: "Remove Staff Member",
      message: "Are you sure you want to remove this staff member from the team? This will affect your available booking slots.",
      type: "confirm",
      onConfirm: () => deleteStaff.mutate(id)
    });
  };

  // Toggle active status mutation
  const toggleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
  });

  return (
    <>
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Team</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">STAFF MANAGEMENT</p>
        </div>
        <Button variant="luxury" size="sm" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {staff?.map((person) => (
          <div key={person.id} className="bg-card border border-border overflow-hidden flex flex-col">
            <div className="h-48 bg-muted relative">
               {person.image_url ? (
                 <img src={person.image_url} alt={person.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase tracking-[0.2em] text-[10px]">No image</div>
               )}
               <div className="absolute top-4 right-4">
                 <span className={`text-[10px] uppercase tracking-widest px-3 py-1 font-bold rounded-none ${person.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                   {person.is_active ? "Active" : "Inactive"}
                 </span>
               </div>
            </div>
            
            <div className="p-8 flex-grow space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-bold uppercase tracking-widest">{person.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{person.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 mr-3" /> {person.email || "No email"}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 mr-3" /> {person.phone || "No phone"}
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-between">
                <button
                  onClick={() => toggleStatus.mutate({ id: person.id, isActive: !person.is_active })}
                  className="text-[10px] uppercase tracking-widest font-bold flex items-center hover:text-foreground transition-colors"
                >
                  {person.is_active ? (
                    <><ShieldAlert className="w-3.5 h-3.5 mr-2" /> Deactivate</>
                  ) : (
                    <><ShieldCheck className="w-3.5 h-3.5 mr-2" /> Activate</>
                  )}
                </button>
                <div className="flex space-x-4">
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleEdit(person)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-muted-foreground hover:text-red-600 transition-colors"
                    onClick={() => confirmDelete(person.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="col-span-full py-20 text-center animate-pulse uppercase tracking-[0.3em] font-light">
            Recruiting Team...
          </div>
        )}
        {!isLoading && staff?.length === 0 && (
          <div className="col-span-full py-20 bg-card border border-border text-center uppercase tracking-[0.3em] font-light text-muted-foreground">
            No staff members found.
          </div>
        )}
      </div>
    </div>

    {/* Staff Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-card border border-border w-full max-w-lg p-10 space-y-8 relative">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            <h2 className="text-2xl font-heading uppercase tracking-widest">
              {editingStaff ? "Edit Staff" : "Add New Staff"}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Team management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Full Name</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: ""});
                }}
                className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.name ? 'border-red-500' : 'border-border'}`} 
              />
              {errors.name && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Role / Title</label>
              <input 
                required
                value={formData.role}
                onChange={(e) => {
                  setFormData({...formData, role: e.target.value});
                  if (errors.role) setErrors({...errors, role: ""});
                }}
                className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.role ? 'border-red-500' : 'border-border'}`} 
              />
              {errors.role && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.role}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ""});
                  }}
                  className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.email && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Phone</label>
                <input 
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: ""});
                  }}
                  className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.phone ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.phone && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Bio / Specialization</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-transparent border-b border-border py-2 text-sm font-light focus:outline-none focus:border-primary h-20 resize-none" 
              />
            </div>

            <Button type="submit" variant="luxury" className="w-full" isLoading={saveStaff.isPending}>
              {editingStaff ? "Update Staff" : "Add to Team"}
            </Button>
          </form>
        </div>
      </div>
    )}

    <CustomDialog 
      {...dialogConfig}
      onClose={() => setDialogConfig({ ...dialogConfig, isOpen: false })}
    />
    </>
  );
}
