import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";
import { hash } from "bcryptjs";

type CustomResponse = {};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method !== "POST") {
	} else {
		const { email, password, name } = req.body;
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
			email: email,
			password: hashedPassword,
			name: name,
			provider: "credentials",
			favorites: [],
		});

		console.log(result);

		res.status(200).json({ message: "User created" });
	}
}
