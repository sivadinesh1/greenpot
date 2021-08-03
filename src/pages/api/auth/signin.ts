import handler from '../handler';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import cookie from 'cookie';

import { checkEmailExists } from './common';

export default handler.post(async (req, res) => {
	const { email, password } = req.body;

	let user: any = await checkEmailExists(email);

	if (user !== 0) {
		if (await bcrypt.compare(password, user.hashed_password)) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1d',
			});
			const { id, username, name, email, role, companyid } = user;

			res.setHeader(
				'Set-Cookie',
				cookie.serialize('token', 'redapple', {
					httpOnly: true,
					secure: process.env.NODE_ENV !== 'development',
					maxAge: 60 * 60,
					sameSite: 'strict',
					path: '/',
				}),
			);

			return res.json({
				user: { id, username, name, companyid, email, role },
			});

			// success
		} else {
			// failure
			res.json({ message: 'Password match failed', errorCode: 1 });
		}
	} else {
		res.json({ message: 'User Not Found', errorCode: 1 });
	}
});
