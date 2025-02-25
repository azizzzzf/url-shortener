'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';

export default function ShortenForm() {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getShortUrl = (code: string) => {
        return `https://${window.location.host}/${code}`;
    };

    const handleSumbit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Validasi URL
        if (!validateUrl(url)) {
            setError('URL is not valid. Please enter a valid URL');
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            // Reset form dan refresh data
            setUrl('');
            setError('');
            router.refresh();

            // Gunakan fungsi getShortUrl untuk URL yang disingkat
            alert(`URL shortener success: ${getShortUrl(data.ShortCode)}`);
        } catch (error) {
            console.error('Error shortening URL:', error);
            setError('Failed to shorten URL. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSumbit} className="relative">
            <div className="space-y-4">
                <div className="relative flex-1">
                    <Input 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        className="h-11 w-full pr-4 font-medium bg-[#013220]/30 border-[#8a9a5b]/20 text-[#f5f5f0] placeholder:text-[#e0e0d0]/60 focus:border-[#8a9a5b]/40 focus:ring-1 focus:ring-[#8a9a5b]/40 transition-colors" 
                        type="url" 
                        placeholder="Enter your long URL here" 
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div className="flex justify-center w-full">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="relative inline-flex h-11 w-full max-w-full overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-[#8a9a5b]/40 focus:ring-offset-2 focus:ring-offset-[#001a10]"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#bcb88a_0%,#013220_50%,#bcb88a_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-[#001a10] px-8 py-1 text-sm font-medium text-[#f5f5f0] backdrop-blur-3xl">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-[#f5f5f0]" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Processing...</span>
                                </span>
                            ) : (
                                'Transform'
                            )}
                        </span>
                    </button>
                </div>
                
                {error && (
                    <p className="text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}