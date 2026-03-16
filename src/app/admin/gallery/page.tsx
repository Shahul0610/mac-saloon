"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/Button";

export default function GalleryManagement() {
  const queryClient = useQueryClient();

  // Fetch gallery
  const { data: images, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Assets</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">GALLERY MANAGER</p>
        </div>
        <Button variant="luxury" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Upload Imagery
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images?.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-muted border border-border overflow-hidden">
             <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold">{img.category || "Uncategorized"}</span>
                <div className="flex space-x-2">
                  <button className="p-3 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a href={img.image_url} target="_blank" rel="noreferrer" className="p-3 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="col-span-full py-40 text-center animate-pulse flex flex-col items-center space-y-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <span className="uppercase tracking-[0.4em] text-xs font-light">Loading Assets...</span>
          </div>
        )}
        {!isLoading && images?.length === 0 && (
          <div className="col-span-full py-40 bg-card border border-border flex flex-col items-center justify-center space-y-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <span className="uppercase tracking-[0.4em] text-xs font-light text-muted-foreground">Portfolio Empty</span>
            <Button variant="outline" size="sm" className="mt-4">Start Uploading</Button>
          </div>
        )}
      </div>
    </div>
  );
}
