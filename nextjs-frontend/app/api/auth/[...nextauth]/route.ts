import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                try {
                    const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const user = await res.json();

                    if (!res.ok || !user) {
                        throw new Error(user?.message || "Invalid credentials");
                    }

                    // Return user object for session
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.email.split('@')[0], // Default name from email if not provided
                        role: user.role,
                        accessToken: user.token,
                        orgId: user.orgId,
                        subscription: user.subscription
                    };
                } catch (error: any) {
                    console.error("NextAuth Login Error:");
                    console.error(" - URL: http://localhost:5000/api/auth/login");
                    console.error(" - Credentials:", { email: credentials.email, password: '***' });
                    console.error(" - Error Message:", error.message);
                    if (error.cause) console.error(" - Cause:", error.cause);
                    throw new Error(error.message || "Login failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.orgId = user.orgId;
                token.subscription = user.subscription;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.orgId = token.orgId as string;
                session.accessToken = token.accessToken as string;
                session.user.subscription = token.subscription;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
