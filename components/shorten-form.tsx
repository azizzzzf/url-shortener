'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
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

    const handleSumbit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Validasi URL
        if (!validateUrl(url)) {
            setError('URL tidak valid. Pastikan URL dimulai dengan http:// atau https://');
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
                throw new Error(data.error || 'Gagal menyingkat URL');
            }

            // Reset form dan refresh data
            setUrl('');
            setError('');
            router.refresh();

            // Tampilkan URL yang berhasil disingkat
            alert(`URL berhasil disingkat: ${window.location.origin}/${data.ShortCode}`);
        } catch (error) {
            console.error('Error shortening URL:', error);
            setError('Gagal menyingkat URL. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSumbit} className='space-y-4'>
            <div className='space-y-2'>
                <Input 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className='h-10' 
                    type='url' 
                    placeholder='Enter URL to shorten (e.g., https://example.com)' 
                    required
                    disabled={isLoading}
                />
                {error && (
                    <p className='text-sm text-red-500'>{error}</p>
                )}
            </div>
            <Button 
                className='w-full p-2' 
                type='submit'
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Shorten URL'}
            </Button>
        </form>
    );
}
