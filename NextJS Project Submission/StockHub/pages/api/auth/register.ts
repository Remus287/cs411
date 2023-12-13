import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";
import { hash } from "bcryptjs";
import { sendMail } from "@lib/sendgrid";

type CustomResponse = {};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method !== "POST") {
	} else {
		const { username, email, password, name } = req.body;
		const client = await clientPromise;
		const db = client.db();

		const collection = db.collection("users");

		const exists = await collection.findOne({ email: email });

		if (exists) {
			res.status(400).json({ message: "User already exists" });
			return;
		}

		const hashedPassword = await hash(password, 12);

		const result = await collection.insertOne({
			username: username,
			email: email,
			password: hashedPassword,
			name: name,
			provider: "credentials",
			favorites: [],
			emailVerified: true,
		});

		res.status(200).json({ message: "User created" });
	}
}

async function sha256(message: string) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message);

	// hash the message
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
