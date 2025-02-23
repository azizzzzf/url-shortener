import React from 'react';
import ShortenForm from './shorten-form';
import UrlList from './url-list';

export default function UrlShortenerContainer() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <ShortenForm />
      </div>
      <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border">
        <UrlList />
      </div>
    </div>
  );
}
