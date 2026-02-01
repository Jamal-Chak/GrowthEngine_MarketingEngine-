'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthPage() {
    const [status, setStatus] = useState('Testing...');
    const [error, setError] = useState('');
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (result: string) => {
        setTestResults(prev => [...prev, result]);
    };

    const testAuth = async () => {
        try {
            // Test 1: Check Supabase config
            addResult('✓ Supabase client initialized');
            addResult(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

            // Test 2: Check connection
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                addResult(`✗ Session check failed: ${sessionError.message}`);
            } else {
                addResult(`✓ Connection successful. Current session: ${session ? 'Active' : 'None'}`);
            }

            // Test 3: Try a test signup
            const testEmail = `test${Date.now()}@test.com`;
            const testPassword = 'testpass123';

            addResult(`\nTesting signup with: ${testEmail}`);
            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: testPassword,
            });

            if (error) {
                addResult(`✗ Signup failed: ${error.message}`);
                setError(error.message);
            } else {
                addResult(`✓ Signup successful!`);
                addResult(`User ID: ${data.user?.id}`);
                addResult(`Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
                addResult(`Session: ${data.session ? 'Created' : 'Email confirmation required'}`);
            }

            setStatus('Tests complete');
        } catch (err: any) {
            addResult(`✗ Fatal error: ${err.message}`);
            setError(err.message);
            setStatus('Tests failed');
        }
    };

    useEffect(() => {
        testAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Authentication Test Page</h1>
                <div className="bg-gray-800 p-6 rounded-lg mb-4">
                    <h2 className="text-xl font-semibold mb-2">Status: {status}</h2>
                    {error && (
                        <div className="bg-red-900/50 border border-red-500 p-4 rounded mt-4">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
                    <div className="font-mono text-sm space-y-1">
                        {testResults.map((result, i) => (
                            <div key={i} className={result.startsWith('✗') ? 'text-red-400' : 'text-green-400'}>
                                {result}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={testAuth}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
                    >
                        Run Tests Again
                    </button>
                </div>
            </div>
        </div>
    );
}
