import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope:
                        "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allow relative URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allow URLs on the same origin
            if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/inbox`;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
