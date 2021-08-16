import { getLoginSession } from '../../../lib/auth';
import { getUser } from '../auth/common';
const jwt = require('jsonwebtoken');
import cookie from 'cookie';
import { isEmpty } from '../../../components/utils/util';

export default async function user(req, res) {
	try {
		const session = await getLoginSession(req);
		const user = (session && (await getUser(session))) ?? null;

		res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).end('Authentication token is invalid, please log in');
	}
}

export const parseCookies = async (req) => {
	let cCookie = cookie.parse(req ? req.headers.cookie || '' : document.cookie);

	if (!isEmpty(cCookie)) {
		let est = jwt.verify(cCookie['authToken'], process.env.JWT_SECRET);
		let user_id = est.id;
		let company_id = est.companyid;

		if (est.exp < new Date().getTime() / 1000) {
			let user_id = undefined;
			let company_id = undefined;
			return { user_id, company_id };
		} else {
			return { user_id, company_id };
		}
	} else {
		let user_id = undefined;
		let company_id = undefined;
		return { user_id, company_id };
	}
};
