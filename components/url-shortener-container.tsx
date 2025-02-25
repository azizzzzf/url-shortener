"use client";

import React from 'react';
import ShortenForm from './shorten-form';
import UrlList from './url-list';

export default function UrlShortenerContainer() {
  return (
    <div className="space-y-8">
      <div className="bg-[#001a10]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 p-6 sm:p-8 hover:shadow-xl hover:bg-[#012211]/50 transition-all duration-500 overflow-hidden relative group">
        {/* Grid Background with Gradient for ShortenForm */}
        <div className="absolute inset-0 z-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0 animate-grid-lines" 
            style={{ 
              backgroundSize: '20px 20px', 
              backgroundImage: `linear-gradient(to right, #bcb88a50 1px, transparent 1px), 
                                linear-gradient(to bottom, #bcb88a50 1px, transparent 1px)` 
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/20 to-[#001a10] opacity-60"></div>
        </div>
        <div className="relative z-10">
          <ShortenForm />
        </div>
      </div>
      <div className="bg-[#001a10]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 hover:shadow-xl hover:bg-[#012211]/50 transition-all duration-500 overflow-hidden relative group">
        {/* Grid Background with Gradient for UrlList */}
        <div className="absolute inset-0 z-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0 animate-grid-lines" 
            style={{ 
              backgroundSize: '25px 25px', 
              backgroundImage: `linear-gradient(to right, #bcb88a50 1px, transparent 1px), 
                                linear-gradient(to bottom, #bcb88a50 1px, transparent 1px)` 
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/20 to-[#001a10] opacity-60"></div>
        </div>
        <div className="relative z-10">
          <UrlList />
        </div>
      </div>
    </div>
  );
}
