'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function ShortenForm() {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSumbit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    url
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            setUrl('');
            // Refresh data setelah berhasil
            router.refresh();
            // Tunggu sebentar sebelum merefresh untuk memastikan data tersimpan
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Error shortening URL:', error);
            alert('Gagal menyingkat URL. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSumbit} className='mb-4'>
            <div className='space-y-4'>
                <Input 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className='h-10' 
                    type='url' 
                    placeholder='Enter URL to shorten' 
                    required
                    disabled={isLoading}
                />
                <Button 
                    className='w-full p-2' 
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Shorten URL'}
                </Button>
            </div>
        </form>
    );
}
