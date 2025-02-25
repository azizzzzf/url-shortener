"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, LinkIcon, LoaderIcon } from "lucide-react";

/**
 * ShortenForm Component
 * 
 * Komponen untuk mempersingkat URL dengan validasi dan feedback pengguna.
 */
export default function ShortenForm() {
  // State Management
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Validasi URL yang dimasukkan
   * @returns {boolean} True jika URL valid, false jika tidak
   */
  const validateUrl = (): boolean => {
    // Cek apakah URL kosong
    if (!url.trim()) {
      setError("Please enter a URL");
      return false;
    }
    
    // Cek apakah URL valid
    try {
      new URL(url);
      return true;
    } catch {
      setError("Please enter a valid URL");
      return false;
    }
  };

  /**
   * Mengirim permintaan ke API untuk mempersingkat URL
   */
  const shortenUrl = async (): Promise<void> => {
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Reset form
      setUrl("");
      
      // Buat URL lengkap
      const shortenedUrl = `https://${window.location.host}/${data.ShortCode}`;
      
      // Tampilkan pesan sukses
      alert(`URL shortened successfully! Your shortened URL is: ${shortenedUrl}\n\nYou can copy this URL manually.`);
      
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Menangani submit form
   * @param {React.FormEvent} e - Event form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validasi input
    if (!validateUrl()) {
      return;
    }
    
    // Mulai loading
    setIsLoading(true);
    
    // Proses persingkatan URL
    await shortenUrl();
  };

  // Render UI Components
  const renderErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="flex items-center space-x-2 text-red-400 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span>{error}</span>
      </div>
    );
  };

  const renderButtonContent = () => {
    return isLoading ? (
      <>
        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
        Shortening...
      </>
    ) : (
      <>
        Shorten URL
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="space-y-2">
      </div>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0e0d0]/70">
              <LinkIcon className="h-5 w-5" />
            </div>
            <Input
              id="url-input"
              type="text"
              placeholder="Enter your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 w-full pl-10 pr-4 font-medium bg-[#013220]/30 border-[#8a9a5b]/20 text-[#f5f5f0] placeholder:text-[#e0e0d0]/60 focus:border-[#8a9a5b]/40 focus:ring-1 focus:ring-[#8a9a5b]/40 transition-colors"
              required
            />
          </div>
          {renderErrorMessage()}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-[#013220] to-[#014421] hover:from-[#014421] hover:to-[#015622] text-[#f5f5f0] border border-[#8a9a5b]/30 shadow-md"
        >
          {renderButtonContent()}
        </Button>
      </form>
      
      {/* Tips Section */}
      <div className="pt-2 border-t border-[#8a9a5b]/20">
        <p className="text-xs text-[#e0e0d0]/60 italic">
          Tip: Shortened URLs are perfect for sharing on social media, emails, or anywhere character count matters.
        </p>
      </div>
    </div>
  );
}
  
  