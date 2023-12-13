import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";

interface CustomResponse {
	message?: string;
	favorites?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "GET") {
		const { email } = req.query;

		const client = await clientPromise;
		const db = client.db();
		const collection = db.collection("users");

		const userCollection = await collection.findOne({ email: email });

		const favorites = userCollection?.favorites;

		res.status(200).json({ favorites: favorites });
	} else {
		res.status(400).json({ message: "Method not supported" });
	}
}
