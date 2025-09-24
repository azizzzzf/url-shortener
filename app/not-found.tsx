import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#001a10] via-[#012211] to-[#1a2f1d] pb-20 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a10] via-[#012211]/90 to-[#014421]/70 opacity-80 z-0"></div>

      <div className="flex-1 flex items-center justify-center container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#013220]/40 to-[#014421]/20 backdrop-blur-md mb-6 border border-[#8a9a5b]/20">
            <span className="text-2xl text-emerald-400">?</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#f5f5f0] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-[#e0e0d0]/80">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#013220] to-[#014421] hover:from-[#014421] hover:to-[#015622] text-[#f5f5f0] border border-[#8a9a5b]/30 rounded-lg font-medium transition-colors shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}