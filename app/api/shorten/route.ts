import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        // Validasi URL
        if (!url) {
            return NextResponse.json(
                { error: 'URL tidak boleh kosong' },
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'URL tidak valid' },
                { status: 400 }
            );
        }

        // Generate short code
        const shortCode = nanoid(8); // 8 karakter random

        // Cek apakah shortCode sudah ada
        const existingUrl = await prisma.url.findFirst({
            where: {
                ShortCode: shortCode,
            },
        });

        if (existingUrl) {
            return NextResponse.json(
                { error: 'Gagal membuat kode unik, silakan coba lagi' },
                { status: 500 }
            );
        }

        // Simpan URL ke database
        const newUrl = await prisma.url.create({
            data: {
                originalUrl: url,
                ShortCode: shortCode,
                visits: 0,
            },
        });

        return NextResponse.json(newUrl);
    } catch (error) {
        console.error('Error creating shortened URL:', error);
        return NextResponse.json(
            { error: 'Gagal menyingkat URL' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}