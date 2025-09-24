import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { originalUrl, customName } = await request.json();

    // Validasi input
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!customName) {
      return NextResponse.json(
        { error: 'Custom name is required' },
        { status: 400 }
      );
    }

    // Validasi URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validasi custom name format
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(customName)) {
      return NextResponse.json(
        { error: 'Custom name can only contain letters, numbers, dashes, and underscores' },
        { status: 400 }
      );
    }

    if (customName.length < 3 || customName.length > 30) {
      return NextResponse.json(
        { error: 'Custom name must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    // Cek apakah custom name sudah digunakan
    const existingUrl = await prisma.url.findUnique({
      where: {
        shortCode: customName,
      },
    });

    if (existingUrl) {
      return NextResponse.json(
        { error: 'Custom name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }

    // Simpan URL ke database
    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortCode: customName,
        visits: 0,
      },
    });

    return NextResponse.json({
      id: newUrl.id,
      shortCode: newUrl.shortCode,
      originalUrl: newUrl.originalUrl,
      visits: newUrl.visits,
      createdAt: newUrl.createdAt,
    });

  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL. Please try again.' },
      { status: 500 }
    );
  }
}