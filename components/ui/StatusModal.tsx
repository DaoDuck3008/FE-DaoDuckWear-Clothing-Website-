"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { createPortal } from "react-dom";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "warning";
  title: string;
  message: string;
  buttonText?: string;
  onAction?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonText = "Xác nhận",
  onAction,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Top Accent Bar */}
        <div className={cn(
          "h-1.5 w-full",
          type === "success" ? "bg-green-500" : "bg-amber-500"
        )} />

        <div className="p-8 pt-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-150",
            type === "success" ? "bg-green-50" : "bg-amber-50"
          )}>
            {type === "success" ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            )}
          </div>

          {/* Text */}
          <h2 className="font-serif text-2xl font-bold tracking-tight uppercase italic mb-3 text-stone-900">
            {title}
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-[280px]">
            {message}
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className={cn(
              "w-full py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all group",
              type === "success" 
                ? "bg-black text-white hover:bg-stone-800" 
                : "bg-white border border-stone-200 text-stone-900 hover:border-black"
            )}
          >
            {buttonText}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Close Button (Optional/Secondary) */}
          <button 
            onClick={onClose}
            className="mt-4 text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
          >
            Đóng
          </button>
        </div>

        {/* Decorative elements */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone-300 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};
