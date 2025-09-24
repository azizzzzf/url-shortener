"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CopyIcon, EyeIcon, Trash2Icon, ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
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
  id: string;
  shortCode: string;
  originalUrl: string;
  visits: number;
  createdAt: string;
};

interface UrlListProps {
  onUrlsChange?: () => void;
  refreshTrigger?: number;
}

export default function UrlList({ onUrlsChange, refreshTrigger }: UrlListProps) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const shortenerUrl = (code: string) => {
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
    return `${protocol}//${host}/${code}`;
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
      const response = await fetch('/api/urls', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete URL');
      }

      // Update state lokal untuk menghapus URL
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));

      if (onUrlsChange) {
        onUrlsChange();
      }

    } catch (error: unknown) {
      console.error("Error deleting URL:", error);
      alert(error instanceof Error ? error.message : "Failed to delete URL. Please try again.");
    }
  };

  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch("/api/urls");
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();

      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setUrls(data);
      } else {
        console.error("Data yang diterima bukan array:", data);
        setUrls([]);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      setUrls([]);
    }
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchUrls();
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Fetch pertama kali dengan loading
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchUrls();
      setIsLoading(false);
    };
    initialFetch();
    // Removed auto-refresh interval to prevent log bloat
  }, [fetchUrls]);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchUrls();
    }
  }, [refreshTrigger, fetchUrls]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <Card className="bg-gradient-to-br from-[#001a10]/60 via-[#012211]/50 to-[#013220]/40 backdrop-blur-md rounded-xl shadow-lg border border-[#8a9a5b]/20 hover:shadow-xl hover:bg-gradient-to-br hover:from-[#001a10]/70 hover:via-[#012211]/60 hover:to-[#013220]/50 transition-all duration-500 overflow-hidden relative group">
      {/* Grid Background dengan Dots */}
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
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-[#8a9a5b]/20">
          <CardTitle className="text-base sm:text-lg font-medium text-[#f5f5f0] flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2.5 animate-pulse"></div>
              Recent Short URLs
              <span className="ml-2 text-sm font-normal text-[#e0e0d0]/70">
                ({urls.length})
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-[#e0e0d0]/70 hover:text-[#f5f5f0] hover:bg-[#013220]/30"
                  >
                    <RefreshCwIcon
                      className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh URL list</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8a9a5b]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#8a9a5b]/50">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 sm:p-5 animate-pulse border-b border-[#8a9a5b]/10 last:border-b-0">
                  <div className="space-y-3">
                    <div className="h-5 bg-[#8a9a5b]/20 rounded-md w-2/3 animate-pulse" />
                    <div className="h-4 bg-[#8a9a5b]/20 rounded-md w-1/2 animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-[#8a9a5b]/20 rounded-md w-1/4 animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-[#8a9a5b]/20 rounded-md animate-pulse" />
                        <div className="h-8 w-8 bg-[#8a9a5b]/20 rounded-md animate-pulse" />
                        <div className="h-8 w-16 bg-[#8a9a5b]/20 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : urls && urls.length > 0 ? (
            urls.map((url) => (
              <div
                key={url.id}
                className="p-4 sm:p-5 group/item hover:bg-[#8a9a5b]/5 transition-all duration-300 relative overflow-hidden border-b border-[#8a9a5b]/10 last:border-b-0"
              >
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                <div className="space-y-3 max-w-full relative z-10">
                  <div className="space-y-2 overflow-hidden">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/${url.shortCode}`}
                        target="_blank"
                        className="text-[#f5f5f0] hover:text-emerald-300 hover:underline font-medium transition-colors duration-200 truncate flex items-center gap-2 flex-1 min-w-0"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0"></span>
                        <span className="truncate">{shortenerUrl(url.shortCode)}</span>
                        <ExternalLinkIcon className="h-3 w-3 flex-shrink-0 opacity-70" />
                      </Link>
                      <span className="text-xs text-[#e0e0d0]/60 flex-shrink-0">
                        {formatDate(url.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#e0e0d0]/80 truncate pl-3.5" title={url.originalUrl}>
                      {truncateUrl(url.originalUrl)}
                    </p>
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
                                ? "bg-emerald-500/20 text-[#f5f5f0]"
                                : "text-[#e0e0d0] hover:text-[#f5f5f0] hover:bg-[#8a9a5b]/20"
                            } transition-all duration-200 flex-shrink-0`}
                            onClick={() => copyToClipboard(url.id, shortenerUrl(url.shortCode))}
                          >
                            <CopyIcon className="h-4 w-4" />
                            <span className="sr-only">Copy URL</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-[#001a10]/90 backdrop-blur-md text-[#f5f5f0] border-[#8a9a5b]/30 shadow-xl"
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
                                className="h-8 w-8 rounded-lg text-[#e0e0d0] hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 flex-shrink-0"
                              >
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only">Delete URL</span>
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-[#001a10]/90 backdrop-blur-md text-[#f5f5f0] border-[#8a9a5b]/30 shadow-xl"
                          >
                            Delete URL
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialogContent className="bg-[#001a10]/95 backdrop-blur-xl border border-[#8a9a5b]/40 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#f5f5f0]">Delete Short URL?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#e0e0d0]/80">
                              This will permanently delete the shortened URL. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-[#013220] text-[#e0e0d0] hover:bg-[#014421] hover:text-[#f5f5f0] border-none transition-all duration-200">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUrl(url.id)}
                              className="bg-red-500/80 hover:bg-red-500 text-[#f5f5f0] border-none transition-all duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#013220]/60 to-[#014421]/40 backdrop-blur-md text-[#f5f5f0] border border-[#8a9a5b]/30 shadow-inner group-hover/item:from-[#013220]/70 group-hover/item:to-[#014421]/50 transition-all duration-300">
                        <EyeIcon className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-medium">{url.visits}</span>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 sm:px-6 py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#013220]/40 to-[#014421]/20 backdrop-blur-md mb-4 border border-[#8a9a5b]/20">
                <EyeIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm text-[#f5f5f0] font-medium">No shortened URLs yet</p>
              <p className="text-xs text-[#e0e0d0]/80 mt-2">Create your first shortened URL above</p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}