import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type CustomResponse = {
	meta?: object;
	values?: object;
	status?: string;
	message?: string;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "GET") {
		const symbol = req.query.symbol;
		const interval = req.query.interval || "1day";

		const client = await clientPromise;

		const db = await client.db();

		const collection = await db.collection("timeSeries");

		const result = await collection.findOne({
			symbol: symbol,
			interval: interval,
		});

		if (result) {
			if (result.dateInserted > new Date(new Date().getTime() - 1000 * 60 * 60 * 24)) {
				res.status(200).json(result.timeSeries);
				return;
			} else {
				await collection.deleteOne({
					symbol: symbol,
					interval: interval,
				});
			}
		}

		const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&&apikey=${process.env.TWELVE_DATA_API_KEY}`);
		const data = await response.json();

		const insertResult = await collection.insertOne({
			symbol: symbol,
			interval: interval,
			timeSeries: data,
			dateInserted: new Date(),
		});

		res.status(200).json(data);
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
