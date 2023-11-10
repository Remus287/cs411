import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";

export default async function register(req: NextApiRequest, res: NextApiResponse) {
	const { username, password, email, firstName, lastName } = req.body
	const client = await clientPromise
	const db = await client.db()
	const collection = await db.collection('users')
	const user = await collection.findOne({ username })
	if (user) {
		res.status(400).json({ error: 'Username already exists' })
		return
	}
	const result = await collection.insertOne({
		username,
		password,
		email,
		firstName,
		lastName,
	})
	res.status(201).json({ message: 'success' })
}