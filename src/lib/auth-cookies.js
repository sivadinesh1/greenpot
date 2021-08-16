import { serialize, parse } from 'cookie';
import cookie from 'cookie';
const jwt = require('jsonwebtoken');
const TOKEN_NAME = 'authToken';

export const MAX_AGE = 60 * 60 * 8; // 8 hours

export function setTokenCookie(res, token) {
	res.setHeader(
		'Set-Cookie',
		cookie.serialize('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 60 * 60,
			sameSite: 'strict',
			path: '/',
		}),
	);

	//   const cookie = serialize(TOKEN_NAME, token, {
	//     maxAge: MAX_AGE,
	//     expires: new Date(Date.now() + MAX_AGE * 1000),
	//     httpOnly: true,
	//     secure: process.env.NODE_ENV === "production",
	//     path: "/",
	//     sameSite: "strict",
	//   });

	// res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie(res) {
	res.setHeader(
		'Set-Cookie',
		cookie.serialize('authToken', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: new Date(0),
			sameSite: 'strict',
			path: '/',
		}),
	);

	// const cookie = serialize(TOKEN_NAME, "", {
	//   maxAge: -1,
	//   path: "/",
	// });

	// res.setHeader("Set-Cookie", cookie);
}

export function parseCookies(req) {
	// For API Routes we don't need to parse the cookies.
	if (req.cookies) return req.cookies;

	// For pages we do need to parse the cookies.
	const cookie = req.headers?.cookie;
	return parse(cookie || '');
}

export function getTokenCookie(req) {
	const cookies = parseCookies(req);
	return cookies[TOKEN_NAME];
}
