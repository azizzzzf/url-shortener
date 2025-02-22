'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { CopyIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Url = {
  id: string;
  ShortCode: string;
  originUrl: string;
  visits: number;
};

interface UrlListProps {
  onUrlsChange?: () => void;
}

export default function UrlList({ onUrlsChange }: UrlListProps) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const shortenerUrl = (code: string) => 
    `${window.location.origin}/${code}`;

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL berhasil disalin!');
    } catch (error) {
      console.error('Gagal menyalin URL:', error);
      alert('Gagal menyalin URL. Silakan coba lagi.');
    }
  };

  const deleteUrl = async (id: string) => {
    try {
      const response = await fetch(`/api/urls`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state lokal untuk menghapus URL
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      
      if (onUrlsChange) {
        onUrlsChange();
      }

      alert('URL berhasil dihapus');
    } catch (error) {
      console.error('Error menghapus URL:', error);
      alert('Gagal menghapus URL. Silakan coba lagi.');
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls');
      const data = await response.json();
      
      // Update state hanya jika data berbeda
      setUrls(prevUrls => {
        const hasChanges = JSON.stringify(prevUrls) !== JSON.stringify(data);
        return hasChanges ? data : prevUrls;
      });
    } catch (error) {
      console.error('Error fetching URLs', error);
    }
  };

  useEffect(() => {
    // Fetch pertama kali dengan loading
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchUrls();
      setIsLoading(false);
    };
    initialFetch();

    // Polling interval tanpa loading
    const interval = setInterval(fetchUrls, 5000);
    return () => clearInterval(interval);
  }, [onUrlsChange]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton loading
            <>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3 animate-pulse"
                >
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            urls.map((url) => (
              <div
                key={url.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Link
                  href={`/${url.ShortCode}`}
                  target="_blank"
                  className="text-primary hover:underline truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                >
                  {shortenerUrl(url.ShortCode)}
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => copyToClipboard(shortenerUrl(url.ShortCode))}
                        >
                          <CopyIcon className="w-4 h-4" />
                          <span className="sr-only">Copy URL</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2Icon className="w-4 h-4" />
                              <span className="sr-only">Delete URL</span>
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Delete URL</TooltipContent>
                      </Tooltip>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the shortened URL.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUrl(url.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                          <EyeIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">{url.visits}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Jumlah kunjungan: {url.visits}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
