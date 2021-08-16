import passport from 'passport';
import nextConnect from 'next-connect';

import passportGoogle from 'passport-google-oauth';

const GoogleStrategy = passportGoogle.OAuth2Strategy;

const strategyOptions = {
	clientID: '364546487930-thq5mmbibddn7l4bdjhp4l2d2jr2bpjj.apps.googleusercontent.com',
	clientSecret: 'z3hRA2tSQXf-UNq4UZ8tEgnl',
	callbackURL: `http://localhost:3000/api/google/callback`,
};

passport.use(
	new GoogleStrategy(strategyOptions, function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}),
);

const authenticate = (method, req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate(
			method,
			{
				scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
			},
			(error, token) => {
				if (error) {
					reject(error);
				} else {
					resolve(token);
				}
			},
		)(req, res);
	});

export default nextConnect()
	.use(passport.initialize())

	.get(async (req, res) => {
		try {
			const user = await authenticate('google', req, res);

			// session is the payload to save in the token, it may contain basic info about the user
			// const session = { ...user };

			// await setLoginSession(res, session);

			res.status(200).send({ done: true });
		} catch (error) {
			console.error(error);
			res.status(401).send(error.message);
		}
	});

// nextConnect().use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.session.cookieKey],
//   })
// )

// nextConnect().use(passport.session())
