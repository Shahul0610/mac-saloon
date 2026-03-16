"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Check, X, Star, MessageSquare } from "lucide-react";

export default function FeedbackManagement() {
  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Approve mutation
  const approve = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string, isApproved: boolean }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: isApproved })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Reputation</h1>
          <p className="text-4xl font-heading font-medium tracking-tight">CUSTOMER FEEDBACK</p>
        </div>
      </div>

      <div className="space-y-6">
        {testimonials?.map((t) => (
          <div key={t.id} className="bg-card border border-border p-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < t.rating ? "fill-foreground text-transparent" : "text-muted"}`} 
                    />
                  ))}
                </div>
                {!t.is_approved && (
                  <span className="text-[8px] uppercase tracking-widest font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-none">Pending Approval</span>
                )}
              </div>
              <p className="text-lg font-light italic leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">{t.customer_name}</span>
                <span className="text-[10px] uppercase tracking-widest font-light text-muted-foreground italic">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              {!t.is_approved && (
                <button 
                  onClick={() => approve.mutate({ id: t.id, isApproved: true })}
                  className="px-6 py-3 border border-foreground text-foreground uppercase tracking-widest text-[10px] font-bold hover:bg-foreground hover:text-background transition-all"
                >
                  Approve
                </button>
              )}
              <button className="p-3 border border-border hover:bg-red-600 hover:text-white transition-all text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="py-20 text-center animate-pulse flex flex-col items-center space-y-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
            <span className="uppercase tracking-[0.4em] text-xs font-light">Reading Reviews...</span>
          </div>
        )}
        {!isLoading && testimonials?.length === 0 && (
          <div className="py-20 bg-card border border-border text-center flex flex-col items-center justify-center space-y-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
            <span className="uppercase tracking-[0.4em] text-xs font-light text-muted-foreground">Silence is Golden</span>
          </div>
        )}
      </div>
    </div>
  );
}
