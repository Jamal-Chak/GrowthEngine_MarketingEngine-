import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        console.log('[REGISTER API] Attempt for:', email);

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Call Backend API
        const backendRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                orgName: `${name}'s Organization` // Default org name
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        console.log('[REGISTER API] Success for:', email);

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: data._id,
                    email: data.email,
                    name: name
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('[REGISTER API] Error:', error.message);
        if (error.cause) console.error('[REGISTER API] Cause:', error.cause);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
