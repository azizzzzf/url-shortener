"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CopyIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  id: string
  ShortCode: string
  originUrl: string
  visits: number
}

interface UrlListProps {
  onUrlsChange?: () => void
}

export default function UrlList({ onUrlsChange }: UrlListProps) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const shortenerUrl = (code: string) => {
    // Gunakan domain pendek jika tersedia, jika tidak gunakan domain saat ini
    const domain = process.env.NEXT_PUBLIC_SHORT_DOMAIN || window.location.host;
    // Gunakan https sebagai default protocol
    return `https://${domain}/${code}`;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    } catch (error) {
      console.error("Copy URL Error:", error);
      alert("Failed to copy URL. Please try again.");
    }
  };

  const deleteUrl = async (id: string) => {
    try {
      const response = await fetch(`/api/urls`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state lokal untuk menghapus URL
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));

      if (onUrlsChange) {
        onUrlsChange();
      }

      alert("URL deleted successfully");
    } catch (error) {
      console.error("Error deleting URL:", error);
      alert("Failed to delete URL. Please try again.");
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls");
      const data = await response.json();

      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setUrls((prevUrls) => {
          const hasChanges = JSON.stringify(prevUrls) !== JSON.stringify(data);
          return hasChanges ? data : prevUrls;
        });
      } else {
        console.error("Data yang diterima bukan array:", data);
        setUrls([]);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      setUrls([]);
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
    <Card className="border rounded-xl shadow-md bg-white">
      <CardHeader className="px-4 sm:px-6 py-4 border-b bg-gray-50/50">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Recent URLs</CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-gray-100">
        {isLoading ? (
          // Skeleton loading
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 sm:p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-100 rounded-md w-2/3 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-8 w-16 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : urls && urls.length > 0 ? (
          urls.map((url) => (
            <div key={url.id} className="p-4 sm:p-6 group hover:bg-gray-50/75 transition-colors duration-200">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Link
                    href={`/${url.ShortCode}`}
                    target="_blank"
                    className="text-primary hover:text-primary/80 hover:underline block font-medium transition-colors duration-200"
                  >
                    {shortenerUrl(url.ShortCode)}
                  </Link>
                  <p className="text-sm text-gray-500 truncate">{url.originUrl}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => copyToClipboard(shortenerUrl(url.ShortCode))}
                        >
                          <CopyIcon className="h-4 w-4" />
                          <span className="sr-only">Copy URL</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Copy to clipboard</TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2Icon className="h-4 w-4" />
                              <span className="sr-only">Delete URL</span>
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete URL</TooltipContent>
                      </Tooltip>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the shortened URL. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUrl(url.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      <EyeIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{url.visits}</span>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 sm:px-6 py-16 text-center">
            <p className="text-sm text-gray-500 font-medium">No shortened URLs yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

