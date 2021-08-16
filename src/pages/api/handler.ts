import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getLoginSession } from '../../lib/auth';

export default nextConnect<NextApiRequest, NextApiResponse>({
	onError(error, req, res) {
		res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
	},
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	},
	attachParams: true,
});
//session validation
// .use(async (req, res, next) => {
// 	const data = await getLoginSession(req);
// 	if (data != null) {
// 		next();
// 	} else {
// 		res.status(200).json({ message: 'Sorry you are not authenticated', session: false, status: 'INVALID' });
// 	}
// });
