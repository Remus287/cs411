import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";
import {hash} from "bcryptjs";

export default async function register(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST'){
		const {username, password, email, firstName, lastName} = req.body;
		
		if (!email || !email.includes('@') ||  !password || !username || !firstName || !lastName) {
			res.status(400).json({error: 'Missing fields'});
			return;
		}
		
		const client = await clientPromise
		const db = await client.db();
		
		const collection = await db.collection('users');
		
		// username has to be new, email has to be new
		
		const user = await collection.findOne({"$or" : [{username : username}, {email : email}]});
		
		if (user) {
			res.status(400).json({error: 'Username or email already exists'});
			return;
		}
		const hashedPassword = await hash(password, 10);
		
		const newUser = await collection.insertOne({
			username : username,
			password : hashedPassword,
			email : email,
			firstName : firstName,
			lastName : lastName,
		});
		
		res.status(200).json({message: newUser});
	}else {
		res.status(400).json({error: 'Wrong request method'});
	}
}