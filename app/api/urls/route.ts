import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Fetch all URLs
export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a URL
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const deletedUrl = await prisma.url.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: 'URL deleted successfully',
      deletedUrl,
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: 'Failed to delete URL. URL may not exist.' },
      { status: 500 }
    );
  }
}