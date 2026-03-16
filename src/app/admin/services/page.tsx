"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Clock, IndianRupee, Tag } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useState } from "react";
import { X } from "lucide-react";
import { CustomDialog } from "@/shared/components/CustomDialog";

export default function ServicesManagement() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, id?: string} & any>({ isOpen: false, title: "", message: "" });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    category: "General"
  });

  // Fetch services
  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Mutations
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    }
  });

  const saveService = useMutation({
    mutationFn: async (data: any) => {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setIsModalOpen(false);
      setEditingService(null);
    }
  });

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category || "General"
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "General"
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveService.mutate(formData);
    }
  };

  const confirmDelete = (id: string) => {
    setDialogConfig({
      isOpen: true,
      id,
      title: "Remove Service",
      message: "Are you sure you want to permanently remove this service from the catalog? This action cannot be undone.",
      type: "confirm",
      onConfirm: () => deleteService.mutate(id)
    });
  };

  return (
    <>
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Catalog</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">SERVICE CATALOG</p>
        </div>
        <Button variant="luxury" size="sm" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" /> New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services?.map((service) => (
          <div key={service.id} className="bg-card border border-border p-8 flex justify-between items-start group">
            <div className="space-y-4 flex-grow">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-heading font-bold uppercase tracking-widest">{service.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-1 font-bold text-muted-foreground italic">
                    {service.category || "General"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center text-xs uppercase tracking-widest font-bold">
                  <Clock className="w-3.5 h-3.5 mr-2" /> {service.duration} MIN
                </div>
                <div className="flex items-center text-xs uppercase tracking-widest font-bold">
                  <IndianRupee className="w-3.5 h-3.5 mr-1" /> {service.price}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-3 border border-border hover:bg-foreground hover:text-background transition-all"
                onClick={() => handleEdit(service)}
              >
                <Edit className="w-4 h-4" />
              </button>
                <button 
                  className="p-3 border border-border hover:bg-red-600 hover:text-white transition-all text-red-600"
                  onClick={() => confirmDelete(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="col-span-full py-20 text-center animate-pulse uppercase tracking-[0.3em] font-light">
            Loading Catalog...
          </div>
        )}
        {!isLoading && services?.length === 0 && (
          <div className="col-span-full py-20 bg-card border border-border text-center uppercase tracking-[0.3em] font-light text-muted-foreground">
            No services in catalog.
          </div>
        )}
      </div>
    </div>

    {/* Service Modal */}
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
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Catalog management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Service Name</label>
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
              <label className="text-[10px] uppercase tracking-widest font-bold">Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => {
                  setFormData({...formData, description: e.target.value});
                  if (errors.description) setErrors({...errors, description: ""});
                }}
                className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary h-20 resize-none transition-colors ${errors.description ? 'border-red-500' : 'border-border'}`} 
              />
              {errors.description && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Price (₹)</label>
                <input 
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({...formData, price: parseFloat(e.target.value)});
                    if (errors.price) setErrors({...errors, price: ""});
                  }}
                  className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.price ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.price && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Duration (Min)</label>
                <input 
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => {
                    setFormData({...formData, duration: parseInt(e.target.value)});
                    if (errors.duration) setErrors({...errors, duration: ""});
                  }}
                  className={`w-full bg-transparent border-b py-2 text-sm font-light focus:outline-none focus:border-primary transition-colors ${errors.duration ? 'border-red-500' : 'border-border'}`} 
                />
                {errors.duration && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.duration}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background border-b border-border py-2 text-sm font-light focus:outline-none focus:border-primary"
              >
                <option value="General">General</option>
                <option value="Haircut">Haircut</option>
                <option value="Styling">Styling</option>
                <option value="Shave">Shave</option>
                <option value="Treatment">Treatment</option>
              </select>
            </div>

            <Button type="submit" variant="luxury" className="w-full" isLoading={saveService.isPending}>
              {editingService ? "Update Service" : "Add to Catalog"}
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
