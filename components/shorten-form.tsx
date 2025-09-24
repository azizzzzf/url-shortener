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
interface ShortenFormProps {
  onUrlCreated?: () => void;
}

export default function ShortenForm({ onUrlCreated }: ShortenFormProps) {
  // State Management
  const [url, setUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validasi input yang dimasukkan
   * @returns {boolean} True jika input valid, false jika tidak
   */
  const validateInput = (): boolean => {
    // Cek apakah URL kosong
    if (!url.trim()) {
      setError("Please enter a URL");
      return false;
    }

    // Cek apakah URL valid
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL");
      return false;
    }

    // Cek apakah custom name kosong
    if (!customName.trim()) {
      setError("Please enter a custom short name");
      return false;
    }

    // Validasi custom name (hanya huruf, angka, dash, underscore)
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(customName.trim())) {
      setError("Custom name can only contain letters, numbers, dashes, and underscores");
      return false;
    }

    // Cek panjang custom name
    if (customName.trim().length < 3) {
      setError("Custom name must be at least 3 characters long");
      return false;
    }

    if (customName.trim().length > 30) {
      setError("Custom name must be no more than 30 characters long");
      return false;
    }

    return true;
  };

  /**
   * Submit URL to API for shortening
   */
  const shortenUrl = async (): Promise<void> => {
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          customName: customName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      // Generate full shortened URL
      const domain = window.location.host;
      const protocol = window.location.protocol;
      const generatedUrl = `${protocol}//${domain}/${data.shortCode}`;
      setShortenedUrl(generatedUrl);

      // Notify parent component that URL was created
      if (onUrlCreated) {
        onUrlCreated();
      }

    } catch (error: unknown) {
      console.error('Error shortening URL:', error);
      setError(error instanceof Error ? error.message : 'Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Copy URL to clipboard
   */
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
      setError("Failed to copy URL. Please try copying manually.");
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
    if (!validateInput()) {
      return;
    }

    // Start loading
    setIsLoading(true);

    // Submit to API
    await shortenUrl();
  };

  /**
   * Reset form
   */
  const resetForm = (): void => {
    setUrl("");
    setCustomName("");
    setShortenedUrl("");
    setError("");
    setCopied(false);
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
        Creating...
      </>
    ) : (
      <>
        Create Short URL
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
              className="h-12 w-full pl-10 pr-4 font-medium bg-[#013220]/30 hover:bg-[#013220]/30 focus:bg-[#013220]/30 border-[#8a9a5b]/20 text-[#f5f5f0] placeholder:text-[#e0e0d0]/60 focus:border-[#8a9a5b]/40 focus:ring-1 focus:ring-[#8a9a5b]/40 transition-colors rounded-lg autofill:!bg-[#013220]/30"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e0e0d0]/70 text-sm">
              @
            </div>
            <Input
              id="custom-name-input"
              type="text"
              placeholder="Enter custom short name (e.g., my-link)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, ''))}
              className="h-12 w-full pl-10 pr-4 font-medium bg-[#013220]/30 hover:bg-[#013220]/30 focus:bg-[#013220]/30 border-[#8a9a5b]/20 text-[#f5f5f0] placeholder:text-[#e0e0d0]/60 focus:border-[#8a9a5b]/40 focus:ring-1 focus:ring-[#8a9a5b]/40 transition-colors rounded-lg autofill:!bg-[#013220]/30"
              maxLength={30}
              required
            />
          </div>

          {renderErrorMessage()}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#013220] to-[#014421] hover:from-[#014421] hover:to-[#015622] text-[#f5f5f0] border border-[#8a9a5b]/30 shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {renderButtonContent()}
        </Button>
      </form>

      {/* Result Section */}
      {shortenedUrl && (
        <div className="mt-8 p-4 sm:p-6 bg-[#013220]/20 border border-[#8a9a5b]/30 rounded-xl">
          <div className="space-y-3">
            <p className="text-sm text-[#e0e0d0]/80">Your shortened URL:</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 p-3 bg-[#001a10]/30 border border-[#8a9a5b]/20 rounded-lg">
                <p className="text-[#f5f5f0] font-medium break-all text-sm">{shortenedUrl}</p>
              </div>
              <Button
                onClick={copyToClipboard}
                className={`px-6 py-3 sm:px-4 sm:py-2 ${copied ? 'bg-green-600/80 hover:bg-green-600' : 'bg-[#013220] hover:bg-[#014421]'} text-[#f5f5f0] transition-colors rounded-lg font-medium whitespace-nowrap`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#e0e0d0]/60">
                Note: This URL will redirect to {url}
              </p>
              <Button
                onClick={resetForm}
                variant="ghost"
                className="text-xs text-[#e0e0d0]/70 hover:text-[#f5f5f0] hover:bg-transparent"
              >
                Create Another
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tips Section */}
      <div className="pt-2 border-t border-[#8a9a5b]/20">
        <p className="text-xs text-[#e0e0d0]/60 italic">
          Tip: Shortened URLs are perfect for sharing on social media, emails, or anywhere character count matters.
        </p>
      </div>
    </div>
  );
}
  
  