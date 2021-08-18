import { NextApiRequest, NextApiResponse } from 'next';
const cloudinary = require('cloudinary').v2;

export default function generateSignature(req: NextApiRequest, res: NextApiResponse) {
	const timestamp = Math.round(new Date().getTime() / 1000);
	let path = `${req.query.path[0]}/${req.query.path[1]}/`;
	const signature = cloudinary.utils.api_sign_request(
		{
			folder: path,
			timestamp: timestamp,
		},
		process.env.CLOUDINARY_SECRET,
	);

	res.statusCode = 200;
	res.json({ signature, timestamp });
}
