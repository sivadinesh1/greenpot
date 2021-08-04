import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

export default nextConnect<NextApiRequest, NextApiResponse>({
	onError(error, req, res) {
		res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	},
	attachParams: true,
});

// if (res.statusCode === 401) {
// 	res.status(401).json({ error: `Authorization Error! ${error.message}` });
// } else {
// 	res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
// }
