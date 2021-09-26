import passport from 'passport';
import nextConnect from 'next-connect';
import axios from 'axios';
const { nanoid } = require('nanoid');

import passportGoogle from 'passport-google-oauth';
import { insertGUser, checkEmailExists, checkIdExists } from '../../../service/auth/auth.service';
import { getDB } from '../../../db-config/db';
const { db } = getDB();
const GoogleStrategy = passportGoogle.OAuth2Strategy;

const strategyOptions = {
	clientID: '364546487930-thq5mmbibddn7l4bdjhp4l2d2jr2bpjj.apps.googleusercontent.com',
	clientSecret: 'z3hRA2tSQXf-UNq4UZ8tEgnl',
	callbackURL: `http://localhost:3000/api/google/callback`,
};
passport.serializeUser((googleUser, done) => {
	done(null, googleUser.id);
});

passport.deserializeUser(async (id, done) => {
	let user = await checkIdExists(id);
	if (user != null) done(null, response.data);
});

passport.use(
	new GoogleStrategy(strategyOptions, function (accessToken, refreshToken, profile, done) {
		let data = create(profile, done);
	}),
);

async function create(data, done) {
	var currentUser = await checkEmailExists(data.emails[0].value);

	if (currentUser) {
		done(null, currentUser);
	} else {
		let temp = {};
		(temp.fname = data.name.givenName), (temp.email = data.emails[0].value), (temp.socialmediaId = data.id);
		let user = saveGuser(temp, done);
	}
}

const saveGuser = async (reqObj, done) => {
	const { fname, email, socialmediaId } = reqObj;
	let username = nanoid(11);
	let source = 'GL';
	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `A`;
	return new Promise(function (resolve, reject) {
		db.one('INSERT INTO users(first_name, email, status, profile_url, source,socialmedia_id) VALUES($1, $2, $3, $4, $5,$6) RETURNING id', [
			fname,
			email,
			status,
			profile,
			source,
			socialmediaId,
		])
			.then((data) => {
				db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1]).then((data) => {
					resolve({ name: fname, message: 'success' });
				});
			})
			.catch((error) => {
				reject({
					error: errorHandler(error),
				});
			});
	});
};

export default nextConnect()
	//   .use(
	//     cookieSession({
	//       maxAge: 1 * 60 * 60 * 1000,
	//       keys: ['squapltestcookies'],
	//     })
	//   )
	.use(passport.initialize())
	.use(passport.session())
	.get(
		passport.authenticate('google', {
			successRedirect: '/admin',
			failureRedirect: '/login',
		}),
		async (req, res) => {
			let user = req.user;
			const session = { ...user };
			//   await setGLoginSession(res, session);
			//   res.redirect('/admin')
			// res.send(req.user)
			// res.send("finally done");
			// return res;
		},
	);
