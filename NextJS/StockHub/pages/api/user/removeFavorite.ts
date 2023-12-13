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
			body = await JSON.parse(req.body);
		} else {
			body = req.body;
		}
		const { email, symbol } = body;

		const client = await clientPromise;
		const db = client.db();
		const collection = db.collection("users");
		const userCollection = await collection.findOne({ email: email });

		let favorites = userCollection?.favorites;

		favorites = favorites.filter((favorite: string) => favorite !== symbol);

		await collection.updateOne({ email: email }, { $set: { favorites: favorites } });

		res.status(200).json({ message: "Favorite removed", favorites: favorites });
	} else {
		res.status(400).json({ message: "Method not supported" });
	}
}
