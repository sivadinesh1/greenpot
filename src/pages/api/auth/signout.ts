import handler from '../handler';
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { checkEmailExists } from './common';

export default handler.post(async (req, res) => {
	res.setHeader(
		'Set-Cookie',
		cookie.serialize('token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: new Date(0),
			sameSite: 'strict',
			path: '/',
		}),
	);

	return res.json({ success: true });
});
