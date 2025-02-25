import UrlShortenerContainer from "@/components/url-shortener-container";
import { TextLoop } from '@/components/ui/text-loop';
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#001a10] via-[#012211] to-[#1a2f1d] pb-[60px] overflow-hidden relative">
      {/* Grid Background with Gradient */}
      <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000 hover:opacity-60 animate-grid-pulse">
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_100%)] animate-grid-lines" 
          style={{ 
            backgroundSize: '30px 30px', 
            backgroundImage: `linear-gradient(to right, #8a9a5b40 1px, transparent 1px), 
                              linear-gradient(to bottom, #8a9a5b40 1px, transparent 1px)` 
          }}>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/30 to-[#001a10] opacity-80"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-[20rem] w-[20rem] rounded-full bg-[#bcb88a]/5 blur-3xl animate-blob1 -top-32 -left-32"></div>
        <div className="absolute h-[20rem] w-[20rem] rounded-full bg-[#8a9a5b]/5 blur-3xl animate-blob2 top-1/2 -right-32"></div>
        <div className="absolute h-[25rem] w-[25rem] rounded-full bg-[#014421]/10 blur-3xl animate-blob3 -bottom-48 left-1/2"></div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12 sm:py-16 md:py-20 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards z-10">
        <div className="max-w-lg mx-auto">
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#bcb88a] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
              URL Shortener
            </h1>
            <TextLoop
              interval={3}
              className="text-base text-[#8a9a5b] font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-forwards"
            >
              {[
                <TextShimmerWave 
                  key="2"
                  duration={2}
                  className="text-[#8a9a5b] [--base-color:#8a9a5b] [--base-gradient-color:#bcb88a]"
                >
                  Create memorable links in seconds
                </TextShimmerWave>,
                <TextShimmerWave 
                  key="3"
                  duration={2}
                  className="text-[#8a9a5b] [--base-color:#8a9a5b] [--base-gradient-color:#bcb88a]"
                >
                  Share your links with confidence
                </TextShimmerWave>,
                <TextShimmerWave 
                  key="4"
                  duration={2}
                  className="text-[#8a9a5b] [--base-color:#8a9a5b] [--base-gradient-color:#bcb88a]"
                >
                  Make your URLs more manageable
                </TextShimmerWave>
              ]}
            </TextLoop>
          </div>
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-forwards">
            <UrlShortenerContainer />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center border-t border-[#8a9a5b]/20 bg-[#001a10]/90 backdrop-blur-sm z-10">
        <p className="text-sm text-[#8a9a5b]">
          © {new Date().getFullYear()} by <span className="font-bold text-[#bcb88a]">Azis Fathur Rahman</span>. All rights reserved.
        </p>
      </footer>
    </main>
  );
}