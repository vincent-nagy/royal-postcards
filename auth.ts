import NextAuth from "next-auth"
import auth0 from "next-auth/providers/auth0"

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [
        auth0({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER,
        }),
    ],
})