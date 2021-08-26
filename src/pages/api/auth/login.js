import passport from 'passport';
import nextConnect from 'next-connect';

import { setLoginSession } from '../../../middlewares/auth';

import { getUserByEmail } from '../../../service/auth/auth.service';
import crypto from 'crypto';
const LocalStrategy = require('passport-local').Strategy;

const validateUser = async (username, password, done) => {
	const user = await getUserByEmail(username);
	if (user && validatePassword(user, password)) {
		done(null, user);
	} else {
		if (user) done(new Error('Invalid username and password combination'));
		else done(new Error('User Not Found'));
	}
};

const authenticate = (method, req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate(method, { session: false }, (error, user) => {
			if (error) {
				resolve({ login: false, error: error });
			} else {
				resolve({ login: true, user: user });
			}
		})(req, res);
	});

export default nextConnect().post(async (req, res) => {
	passport.use(new LocalStrategy(validateUser));

	const { login, user, error } = await authenticate('local', req, res);

	if (login) {
		await setLoginSession(res, user);
		res.status(200).send({ done: true });
	} else {
		res.status(200).send({ done: login, error: error?.message });
	}
});

export function validatePassword(user, inputPassword) {
	const inputHash = crypto.pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512').toString('hex');
	const passwordsMatch = user.hashed_password === inputHash ? true : false;
	return passwordsMatch;
}

// const auth =
// (...requiredRights) =>
// async (req, res, next) => {
// 	return new Promise((resolve, reject) => {
// 		passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
// 	})
// 		.then(() => next())
// 		.catch((err) => next(err));
// };
