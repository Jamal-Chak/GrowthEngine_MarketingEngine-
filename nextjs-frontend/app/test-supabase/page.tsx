'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
    const [status, setStatus] = useState('Ready to test');
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        setStatus('Checking connection...');
        try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            setDetails({
                supabaseUrl: url,
                hasKey: !!key,
                keyLength: key?.length || 0
            });
            setStatus('✅ Connection settings loaded');
        } catch (e: any) {
            setStatus(`❌ Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testSignup = async () => {
        setLoading(true);
        setStatus('Testing signup...');
        try {
            const testEmail = `growth.test.${Date.now()}@gmail.com`;
            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: 'test123456',
                options: {
                    data: { full_name: 'Test User' }
                }
            });

            if (error) {
                setStatus(`❌ Error: ${error.message}`);
                setDetails((prev: any) => ({ ...prev, error: error.message, code: error.status }));
            } else if (data.user) {
                setStatus(`✅ Success! User created: ${data.user.id}`);
                setDetails((prev: any) => ({
                    ...prev,
                    userId: data.user!.id,
                    needsConfirm: data.user!.identities?.length === 0
                }));
            } else {
                setStatus('⚠️ No error but no user created');
            }
        } catch (e: any) {
            setStatus(`❌ Exception: ${e.message}`);
            setDetails((prev: any) => ({ ...prev, exception: e.toString() }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Supabase Connection Test</h1>

            <div className="mb-8 p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Status:</h2>
                <p className="text-2xl">{status}</p>
            </div>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={checkConnection}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                >
                    Check Connection
                </button>
                <button
                    onClick={testSignup}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                    Test Signup (Manual)
                </button>
            </div>

            {details && (
                <div className="p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Details:</h2>
                    <pre className="bg-gray-900 p-4 rounded overflow-auto">
                        {JSON.stringify(details, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8">
                <p className="text-yellow-500 mb-4">
                    ⚠️ Note: Too many signup attempts will trigger rate limiting. Use the button sparingly.
                </p>
                <a href="/" className="text-blue-400 hover:underline">← Back to Home</a>
            </div>
        </div>
    );
}
