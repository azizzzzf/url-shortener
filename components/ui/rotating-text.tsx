'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RotatingTextProps {
  items: string[];
  className?: string;
  duration?: number;
  animationClassName?: string;
  highlightClassName?: string;
}

export const RotatingText = ({
  items,
  className,
  duration = 2000,
  animationClassName,
  highlightClassName,
}: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [maxWidth, setMaxWidth] = useState(0);
  
  // Inisialisasi array refs
  useEffect(() => {
    itemsRef.current = Array(items.length).fill(null);
  }, [items.length]);

  // Rotasi teks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, duration);

    return () => clearInterval(interval);
  }, [items.length, duration]);

  // Mengukur lebar semua item dan mengatur lebar container
  useEffect(() => {
    // Fungsi untuk mengukur lebar semua item
    const measureAllItems = () => {
      // Ukur lebar setiap item yang sudah dirender
      const widths = itemsRef.current
        .filter(Boolean)
        .map(item => item?.offsetWidth || 0);
      
      // Jika ada item yang diukur, tentukan lebar maksimum
      if (widths.length > 0) {
        // Tambahkan sedikit padding untuk menghindari teks terpotong
        const maxItemWidth = Math.max(...widths) + 8;
        setMaxWidth(maxItemWidth);
      }
    };

    // Jalankan pengukuran setelah render
    requestAnimationFrame(() => {
      measureAllItems();
    });
    
    // Jalankan pengukuran lagi setelah beberapa saat untuk memastikan font sudah dimuat
    const timeout = setTimeout(measureAllItems, 100);
    
    return () => clearTimeout(timeout);
  }, [items]);

  // Pastikan lebar container minimal 20px untuk menghindari layout shift
  const containerWidth = Math.max(maxWidth, 20);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-visible inline-block', className)}
      style={{ 
        minWidth: `${containerWidth}px`,
        transition: 'min-width 0.3s ease-out'
      }}
    >
      <AnimatePresence mode="wait">
        {items.map((item, index) => (
          index === currentIndex && (
            <motion.div
              key={item}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ 
                duration: 0.25, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.15 },
                y: { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30 
                }
              }}
              className={cn(
                'whitespace-nowrap text-center',
                animationClassName,
                highlightClassName
              )}
            >
              {item}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}; 