import NextAuth, { Account } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@lib/mongodb";
import { compare } from "bcryptjs";
import { User } from "@auth/core";
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
			credentials: {
				username: { label: "Username", type: "text", placeholder: "Username" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) {
					return null;
				}
				const client = await clientPromise;
				const db = client.db();
				const collection = db.collection("users");

				const exists = await collection.findOne({ $or: [{ email: credentials.username }, { username: credentials.username }] });
				if (!exists) {
					return null;
				}
				if (!exists.emailVerified) {
					return null;
				}

				const isValid = await compare(credentials.password, exists.password);

				if (!isValid) {
					return null;
				}

				const user: User = {
					_id: exists._id.toString(),
					verified: exists.verified,
					name: exists.name,
					username: exists.username,
					email: exists.email,
					image: exists.image,
					provider: exists.provider,
					favorites: exists.favorites,
					password: exists.password,
				};

				return user as any;
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }: { user: User; account: Account }) {
			const client = await clientPromise;
			const db = client.db();

			const collection = db.collection("users");

			const email = user.email;

			const exists = await collection.findOne({ email: email });

			if (exists) {
				return exists.provider !== account.provider ? "/errors/provider" : true;
			}

			const newUser = {
				name: user.name,
				email: email,
				image: user.image,
				provider: account.provider,
				favorites: [],
				emailVerified: true,
			};

			await collection.insertOne(newUser);

			return true;
		},
	},
};

function createPassword() {
	const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "[", "]", "{", "}", "|", ";", ":", "'", '"', ",", ".", "/", "<", ">", "?", "`", "~"];
	const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let password = "";

	for (let i = 0; i < 12; i++) {
		const rand = Math.random();

		if (rand < 0.33) {
			password += symbols[Math.floor(Math.random() * symbols.length)];
		} else if (rand < 0.66) {
			password += digits[Math.floor(Math.random() * digits.length)];
		} else {
			password += letters[Math.floor(Math.random() * letters.length)];
		}
	}

	return password;
}

export default NextAuth(authOptions as any);
