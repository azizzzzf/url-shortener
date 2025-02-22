import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const urls = await prisma.url.findMany({
            orderBy: { CreatedAt: 'desc' },
            take: 10,
            select: {
                id: true,
                ShortCode: true,
                originalUrl: true,
                visits: true,
                CreatedAt: true
            }
        });
        
        console.log('Fetched URLs:', urls);
        return NextResponse.json(urls || []);
    } catch(error) {
        console.error('Error fetching URLs:', error);
        return NextResponse.json([]);
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID tidak ditemukan' },
        { status: 400 }
      );
    }

    const deletedUrl = await prisma.url.delete({
      where: {
        id: id,
      },
    });

    if (!deletedUrl) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'URL berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error menghapus URL:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus URL' },
      { status: 500 }
    );
  }
}