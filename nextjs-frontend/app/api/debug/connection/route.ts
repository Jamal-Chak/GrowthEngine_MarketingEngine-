import { NextResponse } from 'next/server';

export async function GET() {
    const backendUrl = 'http://127.0.0.1:5000/api/health';

    try {
        console.log(`[DEBUG] Testing connection to: ${backendUrl}`);

        const start = Date.now();
        const res = await fetch(backendUrl, { cache: 'no-store' });
        const duration = Date.now() - start;

        console.log(`[DEBUG] Response status: ${res.status}`);

        const data = await res.json();

        return NextResponse.json({
            test: 'Next.js Server -> Backend Server Connection',
            status: 'SUCCESS',
            backendUrl,
            latency: `${duration}ms`,
            backendResponse: data
        });
    } catch (error: any) {
        console.error('[DEBUG] Connection test failed:', error);
        return NextResponse.json({
            test: 'Next.js Server -> Backend Server Connection',
            status: 'FAILED',
            backendUrl,
            error: error.message,
            cause: error.cause ? String(error.cause) : undefined
        }, { status: 500 });
    }
}
