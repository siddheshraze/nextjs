import AzureADProvider from "next-auth/providers/azure-ad";
import NextAuth, { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile user.Read email" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // IMPORTANT: persist access_token to token right after sign in
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    }
  }
}

export default NextAuth(authOptions);