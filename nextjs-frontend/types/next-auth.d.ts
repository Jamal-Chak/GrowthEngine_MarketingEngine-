import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: string
        user: {
            id: string
            role: string
            orgId: string
            subscription?: {
                plan: 'free' | 'pro' | 'agency'
                status: 'active' | 'past_due' | 'canceled' | 'trial'
                validUntil?: string
            }
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        accessToken?: string
        orgId: string
        subscription?: {
            plan: 'free' | 'pro' | 'agency'
            status: 'active' | 'past_due' | 'canceled' | 'trial'
            validUntil?: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        id?: string
    }
}
