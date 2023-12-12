import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";

type CustomResponse = {};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "GET") {
		const slug = req.query.slug as string;

		const [username, token] = slug.split("&");

		const client = await clientPromise;
		const db = client.db();

		const collection = db.collection("users");

		const exists = await collection.findOne({ username: username });
		if (exists) {
			if (exists.emailVerification === token) {
				await collection.updateOne({ username: username }, { $set: { emailVerified: true } });
				res.status(200).json({ valid: true });
				return;
			}
		}

		res.status(200).json({ valid: false });
	} else {
		res.status(400).json({ message: "Invalid request" });
	}
}
