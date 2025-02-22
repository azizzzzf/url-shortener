import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Dapatkan shortCode dari URL
    const url = new URL(request.url);
    const shortCode = url.pathname.split('/').pop();
    
    if (!shortCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Cari URL berdasarkan shortCode
    const urlData = await prisma.url.findFirst({
      where: {
        ShortCode: shortCode,
      },
    });

    if (!urlData) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Update visit count
    await prisma.url.update({
      where: {
        id: urlData.id,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
    });

    // Pastikan update selesai sebelum redirect
    await prisma.$disconnect();

    // Redirect ke URL asli
    return NextResponse.redirect(urlData.originalUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    await prisma.$disconnect();
    return NextResponse.redirect(new URL('/', request.url));
  }
} 