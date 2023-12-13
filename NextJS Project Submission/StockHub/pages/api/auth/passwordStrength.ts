import { NextApiRequest, NextApiResponse } from "next";

type CustomResponse = {};
export default async function handler(req: NextApiRequest, res: NextApiResponse<CustomResponse>) {
	if (req.method !== "POST") {
	} else {
		const { password } = req.body;
		const passwordStrength = checkPasswordStrength(password);
		res.status(200).json({ passwordStrength });
	}
}

function checkPasswordStrength(psw: string) {
	if (psw.length === 0) {
		return 0;
	}
	const veryStrongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})");
	const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
	const mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	const weakRegex = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");

	// pwd that passes veryStrongRegex: 1qazXSW@3edcVFR$5tgbYHN^7ujm&IK<9ol.>

	if (veryStrongRegex.test(psw)) {
		return 5;
	} else if (strongRegex.test(psw)) {
		return 4;
	} else if (mediumRegex.test(psw)) {
		return 3;
	} else if (weakRegex.test(psw)) {
		return 2;
	} else {
		return 1;
	}
}
