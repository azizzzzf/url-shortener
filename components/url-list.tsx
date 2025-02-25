"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const shortenerUrl = (code: string) => {
    return `https://${window.location.host}/${code}`;
  };

  const copyToClipboard = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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

  const fetchUrls = useCallback(async () => {
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
  }, []);

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
  }, [fetchUrls]);

  return (
    <Card className="bg-zinc-900/20 backdrop-blur-xl border border-zinc-800/30 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-zinc-800/30 bg-zinc-900/40 backdrop-filter backdrop-blur-md">
        <CardTitle className="text-lg font-medium text-zinc-100 flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2.5 animate-pulse"></div>
          Recent URLs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[480px] bg-gradient-to-b from-zinc-900/10 to-zinc-900/30">
        <div className="h-full overflow-y-auto divide-y divide-zinc-800/20 scrollbar-thin scrollbar-thumb-zinc-700/30 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600/50">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-5 sm:p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-5 bg-zinc-700/20 rounded-md w-2/3 animate-pulse" />
                    <div className="h-4 bg-zinc-700/20 rounded-md w-1/2 animate-pulse" />
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-8 w-8 bg-zinc-700/20 rounded-md animate-pulse" />
                      <div className="h-8 w-8 bg-zinc-700/20 rounded-md animate-pulse" />
                      <div className="h-8 w-16 bg-zinc-700/20 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : urls && urls.length > 0 ? (
            urls.map((url) => (
              <div
                key={url.id}
                className="p-5 sm:p-6 group hover:bg-zinc-800/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="space-y-3 max-w-full relative z-10">
                  <div className="space-y-1.5 overflow-hidden">
                    <Link
                      href={`/${url.ShortCode}`}
                      target="_blank"
                      className="text-zinc-100 hover:text-emerald-300 hover:underline block font-medium transition-colors duration-200 truncate pr-2 flex items-center"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/70 mr-2"></span>
                      {shortenerUrl(url.ShortCode)}
                    </Link>
                    <p className="text-sm text-zinc-500/80 truncate pr-2 pl-3.5">{url.originUrl}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 flex-shrink-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 rounded-lg ${
                              copiedId === url.id
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/40"
                            } transition-all duration-200 flex-shrink-0`}
                            onClick={() => copyToClipboard(url.id, shortenerUrl(url.ShortCode))}
                          >
                            <CopyIcon className="h-4 w-4" />
                            <span className="sr-only">Copy URL</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-zinc-800/90 backdrop-blur-md text-zinc-100 border-zinc-700/30 shadow-xl"
                        >
                          {copiedId === url.id ? "Copied!" : "Copy to clipboard"}
                        </TooltipContent>
                      </Tooltip>

                      <AlertDialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-lg text-zinc-300 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 flex-shrink-0"
                              >
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only">Delete URL</span>
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-zinc-800/90 backdrop-blur-md text-zinc-100 border-zinc-700/30 shadow-xl"
                          >
                            Delete URL
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialogContent className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/40 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-zinc-100">Delete URL?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                              This will permanently delete the shortened URL. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 border-none transition-all duration-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUrl(url.id)}
                              className="bg-red-500/80 hover:bg-red-500 text-white border-none transition-all duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/60 backdrop-blur-md text-zinc-300 border border-zinc-700/30 shadow-inner">
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/40 backdrop-blur-md mb-4">
                <EyeIcon className="h-5 w-5 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-500 font-medium">No shortened URLs yet</p>
              <p className="text-xs text-zinc-600 mt-2">Create your first shortened URL above</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

