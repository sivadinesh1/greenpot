import { getLoginSession } from '../../../middlewares/auth';
import { getUser } from '../../../service/auth/auth.service';
const jwt = require('jsonwebtoken');
import cookie from 'cookie';
import { isEmpty } from '../../../components/utils/util';

import nc from 'next-connect';
import { auth } from '../../../middlewares/auth';
import { getUserById } from '../../../service/auth/auth.service';

const handler = nc().get(auth('getUsers'), async (req, res) => {
	const user = await getUserById(req.user.id);
	res.status(200).json(user);
});

export default handler;

// export const parseCookies = async (req) => {
// 	let cCookie = cookie.parse(req ? req.headers.cookie || '' : document.cookie);
// 	if (!isEmpty(cCookie)) {
// 		let est = jwt.verify(cCookie['authToken'], process.env.ACCESS_TOKEN_SECRET);
// 		let user_id = est.id;
// 		let company_id = est.companyid;
// 		let role_id = est.role;

// 		if (est.exp < new Date().getTime() / 1000) {
// 			let user_id = undefined;
// 			let company_id = undefined;
// 			let role_id = undefined;
// 			return { user_id, company_id, role_id };
// 		} else {
// 			return { user_id, company_id, role_id };
// 		}
// 	} else {
// 		let user_id = undefined;
// 		let company_id = undefined;
// 		let role_id = undefined;
// 		return { user_id, company_id, role_id };
// 	}
// };
