import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: { shortCode: string } }
) {
  try {
    const shortCode = context.params.shortCode;
    console.log('Processing shortCode:', shortCode);

    // Cari URL berdasarkan shortCode
    const url = await prisma.url.findFirst({
      where: {
        ShortCode: shortCode,
      },
    });

    if (!url) {
      console.log('URL not found for shortCode:', shortCode);
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('Found URL:', url);

    // Update visit count
    const updatedUrl = await prisma.url.update({
      where: {
        id: url.id,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
    });

    console.log('Updated visit count:', updatedUrl.visits);

    // Pastikan update selesai sebelum redirect
    await prisma.$disconnect();

    // Redirect ke URL asli
    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    await prisma.$disconnect();
    return NextResponse.redirect(new URL('/', request.url));
  }
} 