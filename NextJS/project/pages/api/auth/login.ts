import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../../lib/mongodb";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
	const {username, password} = req.body;
	
	const client = await clientPromise
	const db = await client.db();
	const collection = await db.collection('users');
	
	const user = await collection.findOne({username : username});
	//
	// if (user) {
	// 	if (user.password === password) {
	// 		res.status(200).json({message: 'success'});
	// 	}else {
	// 		res.status (400).json ({error: 'Password is incorrect'});
	// 	}
	// }else {
	// 	res.status(400).json({error: 'Username does not exist'});
	// }
	
	// if user exists and password match, redirect on ./feed
	
	if (user && user.password === password) {
		res.status (200).json ({message: 'success'});
	}
	res.status(400).json({error: 'Username or password is incorrect'});
}