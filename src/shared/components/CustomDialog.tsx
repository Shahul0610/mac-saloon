"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "./Button";

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'success' | 'error';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CustomDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'alert',
  onConfirm,
  confirmText = "Continue",
  cancelText = "Cancel"
}: CustomDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-border w-full max-w-md p-8 shadow-2xl overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {type === 'confirm' || type === 'alert' ? (
                    <AlertCircle className="w-6 h-6 text-primary" />
                  ) : type === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className="text-xl font-heading font-bold uppercase tracking-widest">{title}</h3>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                {message}
              </p>

              <div className="flex justify-end gap-4 pt-4">
                {type === 'confirm' && (
                  <Button variant="outline" size="sm" onClick={onClose}>
                    {cancelText}
                  </Button>
                )}
                <Button 
                  variant="luxury" 
                  size="sm" 
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    if (type !== 'confirm' || !onConfirm) onClose();
                  }}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
