import clientPromise from "@lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface CustomResponse {
	meta?: object;
	timeSeries?: any;
	news?: any;
	message?: string;
}
async function fetchTimeSeries(symbol: string, interval: string) {
	const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${process.env.TWELVE_DATA_API_KEY}`);
	return await res.json();
}
async function getTimeSeries(symbol: string, interval: string) {
	const client = await clientPromise;
	const db = client.db();

	const collection = db.collection("timeSeries");
	const timeSeries = await collection.findOne({ symbol: symbol, interval: interval });

	// if it exists, check if it's expired ( > 1 day)

	if (timeSeries) {
		const timeSeriesDate = new Date(timeSeries.dateInserted);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - timeSeriesDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 1) {
			// if it's expired, delete it from the db
			await collection.deleteOne({ symbol: symbol, interval: interval });
		} else {
			// if it's not expired, return it
			return timeSeries;
		}
	}

	// now, fetch
	const res = await fetchTimeSeries(symbol, interval);
	const inserted = await collection.insertOne({ symbol: symbol, interval: interval, dateInserted: new Date(), timeSeries: res });

	return await collection.findOne({ _id: inserted.insertedId });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method === "GET") {
		const symbol = req.query.symbol as string;
		const interval = req.query.interval as string;
		const timeSeries = await getTimeSeries(symbol, interval);
		if (!timeSeries) {
			res.status(404).json({ message: "Time series not found" });
			return;
		}
		res.status(200).json({ meta: timeSeries?.timeSeries?.meta, timeSeries: timeSeries?.timeSeries?.values });
	} else {
		res.status(400).json({ message: "Method not supported" });
	}
}
