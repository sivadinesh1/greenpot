import handler from '../handler';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import cookie from 'cookie';

import { checkEmailExists } from './common';
import { ContactsOutlined } from '@material-ui/icons';

export default handler

	.use(async (req, res, next) => {
		console.log('inside me..middleware');

		const token = req.cookies.authToken || undefined;

		console.log('cookie ' + token);

		if (token === undefined) {
			res.status(401).json({ message: 'Not yet loggedin' });
		} else {
			jwt.verify(req.cookies.authToken, process.env.JWT_SECRET, async function (err, decoded) {
				if (!err && decoded) {
					next();
				} else {
					res.status(401).json({ message: 'Sorry you are not authenticated' });
				}
			});
		}
	})

	.get(async (req, res) => {
		let token = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);

		let id = token.id;

		console.log('dinesh id ' + id);
	});
