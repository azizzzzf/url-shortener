import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { shortCode } = await request.json();

    if (!shortCode) {
      return NextResponse.json(
        { error: 'ShortCode tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cari URL berdasarkan shortCode
    const url = await prisma.url.findFirst({
      where: {
        ShortCode: shortCode,
      },
    });

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update visits count dan dapatkan data terbaru
    const updatedUrl = await prisma.url.update({
      where: {
        id: url.id,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
      select: {
        id: true,
        originalUrl: true,
        ShortCode: true,
        visits: true,
      },
    });

    return NextResponse.json(updatedUrl);
  } catch (error) {
    console.error('Error updating visit count:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate jumlah kunjungan' },
      { status: 500 }
    );
  }
} 