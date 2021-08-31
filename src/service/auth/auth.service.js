const { nanoid } = require('nanoid');
const { encryptPassword } = require('../../dbconfig/utils');
import crypto from 'crypto';
import prisma from '../../dbconfig/prisma';
import { bigIntToString } from '../../dbconfig/utils';

export const checkEmailExists = async (email) => {
	const users = await prisma.users.findUnique({
		where: {
			email: email,
		},
	});
	return bigIntToString(users);
};

export const checkIdExists = async (id) => {
	const users = await prisma.users.findMany({
		where: {
			id: Number(id),
		},
		include: {
			user_role: {
				include: {
					role: true, // Include role categories
				},
			},
		},
	});

	const returnValue = bigIntToString(users);
	returnValue[0]['role_name'] = returnValue[0].user_role[0].role.name;
	returnValue[0]['role_desc'] = returnValue[0].user_role[0].role.description;
	returnValue[0]['role'] = returnValue[0].user_role[0].role_id;
	returnValue[0].user_role = '';

	return returnValue[0];
};

export const insertUser = async (name, email, password, origin, companyId) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	let username = nanoid(11);
	let companyid = companyId;
	let accessRights = 'A';

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `A`;

	const user = await prisma.users.create({
		data: {
			first_name: name,
			email: email,
			status: status,
			salt: salt,
			hashed_password: hash,
			profile_url: profile,
			companyid: Number(companyid),
			access_rights: accessRights,
			user_id: nanoid(11),
			user_role: {
				create: [{ role_id: 1 }],
			},
		},
		include: {
			user_role: true, // users all user_role in the returned object
		},
	});
	const returnValue = bigIntToString(user);

	let returnObj = {
		message: 'success',
		id: returnValue.id,
		role: returnValue.user_role[0].role_id,
		companyid: returnValue.companyid,
	};

	return returnObj;
};

export const getUser = async ({ email }) => {
	const user = await prisma.users.findMany({
		where: {
			email: email,
		},
	});
	const returnValue = bigIntToString(user);
	console.log('test author singup--->', returnValue);
	return returnValue[0];
};

export const getUserByEmail = async (email) => {
	const users = await prisma.users.findMany({
		where: {
			email: email,
		},
		include: {
			user_role: {
				include: {
					role: true, // Include role categories
				},
			},
		},
	});

	const returnValue = bigIntToString(users);

	if (returnValue.length === 0) {
		return null;
	} else {
		returnValue[0]['role_name'] = returnValue[0].user_role[0].role.name;
		returnValue[0]['role_desc'] = returnValue[0].user_role[0].role.description;
		returnValue[0]['role'] = returnValue[0].user_role[0].role_id;
		returnValue[0].user_role = '';
	}

	return returnValue[0];
};

export const getUserById = async (id) => {
	const user = await prisma.users.findUnique({
		where: {
			id: Number(id),
		},
	});

	return bigIntToString(user);
};

export const getUserByNano = async (id) => {
	const user = await prisma.users.findMany({
		where: {
			user_id: id,
		},
	});
	const returnValue = bigIntToString(user);
	console.log('test author singup--->', returnValue);
	return returnValue[0];
};
