// @ts-nocheck
import NextAuth, { Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID || "",
			clientSecret: process.env.GITHUB_SECRET || "",
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || "",
			clientSecret: process.env.GOOGLE_SECRET || "",
		}),
		CredentialsProvider({
			async authorize(credentials) {
				const client = await clientPromise;

				const db = await client.db();

				const collection = await db.collection("users");

				const result = await collection.findOne({ username: credentials.username });
				if (!result) {
					throw new Error("No user found");
				}

				const checkPassword = await compare(credentials.password, result.password);

				if (checkPassword) {
					return { username: result.username, email: result.email, firstName: result.firstName, lastName: result.lastName };
				}
				throw new Error("Wrong password");
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }: { user: AuthUser; account: Account }) {
			const client = await clientPromise;
			const db = await client.db();

			const collection = await db.collections("users");

			console.log("AuthUser", user);
			console.log("Account", account);
			return true;
		},
	},
};

export default NextAuth(authOptions);
