// @ts-nocheck
import NextAuth, { Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
	secret: process.env.NEXT_AUTH_SECRET,
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

				const db = client.db();

				const collection = db.collection("users");

				const exists = await collection.findOne({ email: credentials.email });

				if (!exists) {
					throw new Error("No user found");
				}

				const isValid = await compare(credentials.password, exists.password);

				if (!isValid) {
					throw new Error("Invalid password");
				}

				return {
					name: exists.name,
					email: exists.email,
					image: exists.image,
					provider: exists.provider,
					favorites: exists.favorites,
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }: { user: AuthUser; account: Account }) {
			console.log("user", user);
			console.log("account", account);
			const client = await clientPromise;
			const db = client.db();

			const collection = db.collection("users");

			const email = user.email;

			const exists = await collection.find({ email: email }).toArray();

			console.log(exists);
			if (exists && exists.length !== 0) {
				return exists[0].provider !== account.provider ? "/errors/provider" : true;
			}

			const newUser = {
				name: user.name,
				email: email,
				image: user.image,
				provider: account.provider,
				favorites: [],
			};

			await collection.insertOne(newUser);
			return true;
		},
	},
};

export default NextAuth(authOptions);
