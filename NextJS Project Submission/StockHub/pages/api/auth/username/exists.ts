import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";

type CustomResponse = {};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "POST") {
		const { username } = req.body;

		const client = await clientPromise;
		const db = client.db();

		const collection = db.collection("users");

		const exists = await collection.findOne({ username: username });

		res.status(200).json({ exists: !!exists });
	} else {
		res.status(400).json({ message: "Invalid request" });
	}
}
