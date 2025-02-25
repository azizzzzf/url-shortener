"use client";

import React from 'react';
import ShortenForm from './shorten-form';
import UrlList from './url-list';

export default function UrlShortenerContainer() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#001a10]/60 via-[#012211]/50 to-[#013220]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 p-6 sm:p-8 hover:shadow-xl hover:bg-gradient-to-br hover:from-[#001a10]/70 hover:via-[#012211]/60 hover:to-[#013220]/50 transition-all duration-500 overflow-hidden relative group">
        {/* Grid Background dengan Dots untuk ShortenForm */}
        <div className="absolute inset-0 z-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0" 
            style={{ 
              backgroundSize: '20px 20px', 
              backgroundImage: `
                radial-gradient(circle, #bcb88a30 1px, transparent 1px),
                linear-gradient(to right, #bcb88a30 1px, transparent 1px), 
                linear-gradient(to bottom, #bcb88a30 1px, transparent 1px)
              `,
              backgroundPosition: '0 0, 0 0, 0 0'
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/20 to-[#001a10] opacity-60"></div>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8a9a5b]/10 via-[#bcb88a]/5 to-[#8a9a5b]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative z-10">
          <ShortenForm />
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#001a10]/60 via-[#012211]/50 to-[#013220]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 hover:shadow-xl hover:bg-gradient-to-br hover:from-[#001a10]/70 hover:via-[#012211]/60 hover:to-[#013220]/50 transition-all duration-500 overflow-hidden relative group">
        {/* Grid Background dengan Dots untuk UrlList */}
        <div className="absolute inset-0 z-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0" 
            style={{ 
              backgroundSize: '25px 25px', 
              backgroundImage: `
                radial-gradient(circle, #bcb88a30 1px, transparent 1px),
                linear-gradient(to right, #bcb88a30 1px, transparent 1px), 
                linear-gradient(to bottom, #bcb88a30 1px, transparent 1px)
              `,
              backgroundPosition: '0 0, 0 0, 0 0'
            }}>
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/20 to-[#001a10] opacity-60"></div>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8a9a5b]/10 via-[#bcb88a]/5 to-[#8a9a5b]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative z-10">
          <UrlList />
        </div>
      </div>
    </div>
  );
}
