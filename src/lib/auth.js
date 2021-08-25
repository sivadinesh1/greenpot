import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies';
import Router from 'next/router';
const JWT = require('jsonwebtoken');

export async function setLoginSession(res, user) {
	const token = await signAccessToken(user.id, user.companyid, user.role);

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

const signAccessToken = (id, companyid, role) => {
	return new Promise((resolve, reject) => {
		const payload = { id: id, companyid: companyid, role };
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const options = { expiresIn: '1d' };

		JWT.sign(payload, secret, options, (err, token) => {
			if (err) return reject(err);
			resolve(token);
		});
	});
};

const signRefreshToken = (id, companyid, role) => {
	return new Promise((resolve, reject) => {
		const payload = { id: id, companyid: companyid, role };
		const secret = process.env.REFRESH_TOKEN_SECRET;
		const options = { expiresIn: '1y' };

		JWT.sign(payload, secret, options, (err, token) => {
			if (err) return reject(err);
			resolve(token);
		});
	});
};
