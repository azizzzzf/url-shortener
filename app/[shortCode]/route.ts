import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Cari URL berdasarkan shortCode
    const urlData = await prisma.url.findUnique({
      where: {
        shortCode: shortCode,
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

    // Redirect ke URL asli
    return NextResponse.redirect(urlData.originalUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}