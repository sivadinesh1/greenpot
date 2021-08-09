import handler from '../handler';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import cookie from 'cookie';

import { checkEmailExists } from './common';
import { ContactsOutlined } from '@material-ui/icons';
import prisma from '../../../dbconfig/prisma';
import { bigIntToString } from '../../../dbconfig/utils';
import User from '../../admin/user';

export default handler

	.use(async (req, res, next) => {
		console.log('inside me..middleware');

		const token = req.cookies.authToken || undefined;

		console.log('cookie ' + token);

		if (token === undefined) {
			res.status(200).json('UNAUTHORISED');
		} else {
			jwt.verify(req.cookies.authToken, process.env.JWT_SECRET, async function (err, decoded) {
				if (!err && decoded) {
					next();
				} else {
					res.status(200).json('UNAUTHORISED');
				}
			});
		}
	})

	.get(async (req, res) => {
		let token = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);

		let id = token.id;

		console.log('dinesh id ' + id);
		const result = await getUserById(id);

		const returnValue = bigIntToString(result);
		res.status(200).send(returnValue);
	});

const getUserById = async (id) => {
	const result = await prisma.users.findUnique({
		where: {
			id: Number(id),
		},
		select: {
			id: true,
			first_name: true,
			companyid: true,
			user_role: {
				select: {
					role_id: true,
				},
			},
		},
	});
	return bigIntToString(result);
};

// select: {
// 	id: true,
// 	first_name: true,
// 	companyid: true,
// 	user_role: {
// 		select: {
// 			role_id: true,
// 		},
// 	},
// },
