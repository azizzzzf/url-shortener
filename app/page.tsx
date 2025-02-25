import UrlShortenerContainer from "@/components/url-shortener-container";
import { RotatingText } from '@/components/ui/rotating-text';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#001a10] via-[#012211] to-[#1a2f1d] pb-[60px] overflow-hidden relative">
      {/* Gradient overlay untuk latar belakang */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a10] via-[#012211]/90 to-[#014421]/70 opacity-80 z-0"></div>
      
      {/* Grid Background dengan Dots - Static version */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0" 
          style={{ 
            backgroundSize: '30px 30px', 
            backgroundImage: `
              radial-gradient(circle, #8a9a5b30 1px, transparent 1px),
              linear-gradient(to right, #8a9a5b30 1px, transparent 1px), 
              linear-gradient(to bottom, #8a9a5b30 1px, transparent 1px)
            `,
            backgroundPosition: '0 0, 0 0, 0 0'
          }}>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#001a10]/30 to-[#001a10] opacity-80"></div>
      </div>

      {/* Static background elements dengan gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-[#bcb88a]/10 to-[#8a9a5b]/10 blur-3xl -top-32 -left-32"></div>
        <div className="absolute h-[20rem] w-[20rem] rounded-full bg-gradient-to-tr from-[#014421]/10 to-[#8a9a5b]/10 blur-3xl top-1/2 -right-32"></div>
        <div className="absolute h-[25rem] w-[25rem] rounded-full bg-gradient-to-t from-[#bcb88a]/10 to-[#014421]/10 blur-3xl -bottom-48 left-1/2"></div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f0] tracking-tight">
              URL Shortener
            </h1>
            <div className="text-base text-[#e0e0d0]/90 font-medium">
              <div className="flex items-center justify-center flex-wrap gap-x-1.5">
                <span>Shorten your URL, make it</span>
                <div className="relative inline-block">
                  <RotatingText
                    items={[
                      "simple",
                      "memorable",
                      "shareable",
                      "efficient"
                    ]}
                    duration={3000}
                    className="text-[#f5f5f0] font-semibold px-2.5 py-0.5"
                    highlightClassName="text-[#f5f5f0] font-bold animate-text-glow"
                    animationClassName="transition-all duration-300"
                  />
                  <div 
                    className="absolute inset-0 border border-[#e0e0d0]/30 rounded-md bg-gradient-to-r from-[#001a10]/40 to-[#013220]/30 backdrop-blur-sm -z-10"
                    style={{ 
                      width: 'calc(100%)',
                      transition: 'width 0.3s ease-out'
                    }}
                  ></div>
                </div>
                <span>.</span>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <UrlShortenerContainer />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center border-t border-[#8a9a5b]/20 bg-gradient-to-r from-[#001a10]/90 via-[#012211]/90 to-[#001a10]/90 backdrop-blur-sm z-10">
        <p className="text-sm text-[#e0e0d0]/80">
          © {new Date().getFullYear()} by <span className="font-bold text-[#f5f5f0]">Azis Fathur Rahman</span>. All rights reserved.
        </p>
      </footer>
    </main>
  );
}