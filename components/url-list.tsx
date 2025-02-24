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
    return `https://${window.location.host}/${code}`;
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
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="px-6 py-5 border-b border-[#8a9a5b]/20">
        <CardTitle className="text-lg font-medium text-[#bcb88a]">Recent URLs</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[480px]">
        <div className="h-full overflow-y-auto divide-y divide-[#8a9a5b]/20 scrollbar-thin scrollbar-thumb-[#8a9a5b]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#8a9a5b]/40">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 sm:p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-5 bg-[#8a9a5b]/10 rounded-md w-2/3 animate-pulse" />
                    <div className="h-4 bg-[#8a9a5b]/10 rounded-md w-1/2 animate-pulse" />
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-8 w-8 bg-[#8a9a5b]/10 rounded-md animate-pulse" />
                      <div className="h-8 w-8 bg-[#8a9a5b]/10 rounded-md animate-pulse" />
                      <div className="h-8 w-16 bg-[#8a9a5b]/10 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : urls && urls.length > 0 ? (
            urls.map((url) => (
              <div key={url.id} className="p-4 sm:p-6 group hover:bg-[#8a9a5b]/5 transition-colors duration-200">
                <div className="space-y-3 max-w-full">
                  <div className="space-y-1 overflow-hidden">
                    <Link
                      href={`/${url.ShortCode}`}
                      target="_blank"
                      className="text-[#bcb88a] hover:text-[#8a9a5b] hover:underline block font-medium transition-colors duration-200 truncate pr-2"
                    >
                      {shortenerUrl(url.ShortCode)}
                    </Link>
                    <p className="text-sm text-[#8a9a5b]/80 truncate pr-2">{url.originUrl}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 flex-shrink-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-[#bcb88a] hover:text-[#013220] hover:bg-[#bcb88a] transition-all duration-200 flex-shrink-0"
                            onClick={() => copyToClipboard(shortenerUrl(url.ShortCode))}
                          >
                            <CopyIcon className="h-4 w-4" />
                            <span className="sr-only">Copy URL</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#013220] text-[#bcb88a] border-[#8a9a5b]/20">
                          Copy to clipboard
                        </TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-[#bcb88a] hover:text-[#013220] hover:bg-[#bcb88a] transition-all duration-200 flex-shrink-0"
                              >
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only">Delete URL</span>
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#013220] text-[#bcb88a] border-[#8a9a5b]/20">
                            Delete URL
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialogContent className="bg-[#013220] border-[#8a9a5b]/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#bcb88a]">Delete URL?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#8a9a5b]">
                              This will permanently delete the shortened URL. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-[#bcb88a] text-[#013220] hover:bg-[#8a9a5b] border-none transition-all duration-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUrl(url.id)}
                              className="bg-red-400 hover:bg-red-500 text-white border-none transition-all duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bcb88a] text-[#013220] border-none">
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
              <p className="text-sm text-[#8a9a5b] font-medium">No shortened URLs yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

