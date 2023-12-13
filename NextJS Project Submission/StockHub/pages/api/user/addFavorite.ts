import clientPromise from "@lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
interface CustomResponse {
	message?: string;
	favorites?: string[];
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "POST") {
		let body;
		if (typeof req.body === "string") {
			body = JSON.parse(req.body);
		} else {
			body = req.body;
		}
		const { email, symbol } = body;

		const client = await clientPromise;
		const db = client.db();
		const collection = db.collection("users");
		const userCollection = await collection.findOne({ email: email });

		let favorites = userCollection?.favorites;

		if (favorites.includes(symbol)) {
			res.status(200).json({ message: "Favorite already added", favorites: favorites });
			return;
		}

		favorites.push(symbol);

		await collection.updateOne({ email: email }, { $set: { favorites: favorites } });

		res.status(200).json({ message: "Favorite added", favorites: favorites });
	} else {
		res.status(400).json({ message: "Method not supported" });
	}
}
