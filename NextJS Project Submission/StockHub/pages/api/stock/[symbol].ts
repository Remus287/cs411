import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@lib/mongodb";
import { info } from "autoprefixer";

interface CustomResponse {
	message?: string;
	information?: any;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method == "GET") {
		const symbol = req.query.symbol as string;

		const information = await getInformation(symbol);

		if (!information) {
			res.status(404).json({ message: "Not Found" });
			return;
		}
		res.status(200).json({ information: information?.information });
	} else {
		res.status(404).json({ message: "Not Found" });
	}
}
const fetchInformation = async (symbol: string) => {
	const response = await fetch(`https://api.twelvedata.com/symbol_search?symbol=${symbol}`);
	const json = await response.json();

	let filtered = json.data.filter((result: any) => {
		return result.symbol == symbol;
	});

	filtered = filtered.filter((result: any) => {
		return result.country == "United States";
	});

	return filtered[0];
};
const getInformation = async (symbol: string) => {
	const client = await clientPromise;
	const db = client.db();

	const collection = db.collection("information");
	const information = await collection.findOne({ symbol: symbol });

	if (information) {
		return information;
	}

	const res = await fetchInformation(symbol);
	const inserted = await collection.insertOne({ symbol: symbol, dateInserted: new Date(), information: res });

	return await collection.findOne({ _id: inserted.insertedId });
};
