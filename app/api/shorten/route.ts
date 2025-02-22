import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        // Pastikan koneksi database terbuka
        await prisma.$connect();

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
        let shortCode = nanoid(8);
        let attempts = 0;
        const maxAttempts = 3;

        // Coba generate shortCode unik dengan beberapa percobaan
        while (attempts < maxAttempts) {
            const existingUrl = await prisma.url.findFirst({
                where: {
                    ShortCode: shortCode,
                },
            });

            if (!existingUrl) {
                break;
            }

            shortCode = nanoid(8);
            attempts++;
        }

        if (attempts >= maxAttempts) {
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

        return NextResponse.json({
            id: newUrl.id,
            ShortCode: newUrl.ShortCode,
            originalUrl: newUrl.originalUrl,
            visits: newUrl.visits
        });
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