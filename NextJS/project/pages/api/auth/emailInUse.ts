import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";

type CustomResponse = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method !== "POST") {
	} else {
		const { email } = req.body;
		const client = await clientPromise;
		const db = client.db();

		const collection = db.collection("users");

		const exists = await collection.findOne({ email: email });

		if (exists) {
			res.status(200).json({ exists: true });
			return;
		}
		res.status(200).json({ exists: false });
	}
}
