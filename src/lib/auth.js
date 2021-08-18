import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies';
import Router from 'next/router';
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export async function setLoginSession(res, user) {
	const createdAt = Date.now();

	const token = jwt.sign({ id: user.id, companyid: user.companyid,role:user.role }, process.env.JWT_SECRET, {
		expiresIn: '1d',
	});

	setTokenCookie(res, token);
}

export async function getLoginSession(req) {
	const token = getTokenCookie(req);
	if (!token) {
		// Router.push(`/`);
		return;
	}

	// Validate the expiration date of the session
	if (Date.now() > token.exp) {
		return null;
	}

	return session;
}
