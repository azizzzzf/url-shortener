# Database-less URL Shortener

A simple, client-side URL shortener that allows users to create custom short URLs without requiring a database or server storage.

## Features

- **Database-less**: No data persistence - purely client-side functionality
- **Custom Short Names**: Users can specify their own custom short name for URLs
- **Instant Generation**: URLs are generated immediately without API calls
- **Copy to Clipboard**: One-click copy functionality
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Beautiful gradient design with dark theme

## How It Works

1. Enter your long URL
2. Enter a custom short name (3-30 characters, letters, numbers, dashes, underscores only)
3. Click "Generate Short URL"
4. Copy the generated shortened URL
5. The shortened URL will have format: `https://yourdomain.com/your-custom-name`

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Note

This is a database-less URL shortener, meaning:
- URLs are not stored anywhere
- No tracking or analytics
- No server-side redirect functionality
- Perfect for creating memorable short URLs that you can use with your own redirect setup

Created by **Azis Fathur Rahman**