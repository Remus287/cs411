import clientPromise from "@lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface CustomResponse {
	message?: string;
	news?: any;
}
async function fetchNews(symbol: string) {
	const res = await fetch(`https://stocknewsapi.com/api/v1?tickers=${symbol}&items=3&token=${process.env.STOCK_NEWS_API_KEY}`);
	return await res.json();
}

async function getNews(symbol: string) {
	const client = await clientPromise;
	const db = client.db();

	const collection = db.collection("news");
	const news = await collection.findOne({ symbol: symbol });

	if (news) {
		const newsDate = new Date(news.dateInserted);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - newsDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 1) {
			await collection.deleteOne({ symbol: symbol });
		} else {
			return news;
		}
	}

	const res = await fetchNews(symbol);
	const inserted = await collection.insertOne({ symbol: symbol, dateInserted: new Date(), news: res });

	return await collection.findOne({ _id: inserted.insertedId });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "GET") {
		const symbol = req.query.symbol as string;

		const news = await getNews(symbol);

		if (!news) {
			res.status(404).json({ message: "News not found" });
			return;
		}
		res.status(200).json({ news: news?.news });
	} else {
		res.status(400).json({ message: "Method not supported" });
	}
}
