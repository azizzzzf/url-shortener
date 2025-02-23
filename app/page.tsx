import UrlShortenerContainer from "@/components/url-shortener-container";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              URL Shortener
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Transform your long URLs into short, shareable links
            </p>
          </div>
          <UrlShortenerContainer />
        </div>
      </div>
    </main>
  );
}