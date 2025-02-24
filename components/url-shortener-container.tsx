"use client";

import React from 'react';
import ShortenForm from './shorten-form';
import UrlList from './url-list';

export default function UrlShortenerContainer() {
  return (
    <div className="space-y-8">
      <div className="bg-[#001a10]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 p-6 sm:p-8 hover:shadow-xl hover:bg-[#012211]/50 transition-all duration-500">
        <ShortenForm />
      </div>
      <div className="bg-[#001a10]/40 backdrop-blur-md rounded-2xl shadow-lg border border-[#8a9a5b]/20 hover:shadow-xl hover:bg-[#012211]/50 transition-all duration-500">
        <UrlList />
      </div>
    </div>
  );
}
