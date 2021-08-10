import handler from '../handler';
import { bigIntToString } from '../../../dbconfig/utils';
import prisma from '../../../dbconfig/prisma';
import jwt from 'jsonwebtoken';
import { getDB } from '../../../dbconfig/db';
const { db } = getDB();
const slugify = require('slugify');

export default handler

	.use(async (req, res, next) => {
		console.log('..in category api handler.');
		console.log('cookie ' + req.cookies.authToken);
		const token = req.cookies.authToken;

		jwt.verify(req.cookies.authToken, process.env.JWT_SECRET, async function (err, decoded) {
			if (!err && decoded) {
				next();
			} else {
				res.status(401).json({ message: 'Sorry you are not authenticated' });
			}
		});
	})

	// without parameters
	.get('/api/category/crud/users', async (req, res) => {
		res.status(200).json({ name: 'John Doe 2' });
	})

	// with parameters
	.get('/api/category/crud/company/:id', async (req, res) => {
		const result = await getAllCategories(req.params.id);

		const returnValue = bigIntToString(result);

		res.status(200).json(returnValue);
	})

	// default routes
	.get(async (req, res) => {
		const result = await prisma.categories.findMany({});

		const returnValue = bigIntToString(result);
		res.status(200).json(returnValue);
	})
	// create method
	.post(async (req, res) => {
		const { name, companyid } = req.body;
		const errors = [];

		const isdata = await checkDuplicateNames(name, companyid);

		if (isdata > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		let slug = slugify(name).toLowerCase();

		const result = await prisma.categories.create({
			data: {
				name: name,
				slug: slug,
				companyid: Number(companyid),
			},
		});

		const returnValue = bigIntToString(result);
		res.status(201).send(returnValue);
	})
	// delete
	.delete('/api/category/crud/:id', async (req, res) => {
		await prisma.categories.delete({
			where: {
				id: Number(req.params.id),
			},
		});
		res.send({ result: 'success' });
	})
	// update
	.put(async (req, res) => {
		const { name, categoryid, companyid } = req.body;

		const errors = [];

		const isdata = await checkDuplicateNames(name, companyid);

		if (isdata > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		let slug = slugify(name).toLowerCase();

		await prisma.categories.update({
			where: {
				id: Number(categoryid),
			},
			data: {
				name: name,
				slug: slug,
				companyid: Number(companyid),
			},
		});
		res.status(200).send({ result: 'success' });
	});

// Notes:
// req.query (this is URL ? query string)
// req.params (parameter from method call)

const checkDuplicateNames = async (name, companyid) => {
	const result = await prisma.categories.count({
		where: {
			name: name,
			companyid: Number(companyid),
		},
	});

	return result;
};

export const getAllCategories = async (company_id) => {
	const result = await prisma.categories.findMany({
		where: {
			companyid: Number(company_id),
		},
		orderBy: {
			name: 'asc',
		},
	});
	return bigIntToString(result);
};

export const getAllBlog = async () => {
	const result = await prisma.blog.findMany({});
	return bigIntToString(result);
};

export const getCategories = async (ids) => {
	let query = `select * from categories t where t.id in (${ids})`;

	return new Promise(function (resolve) {
		db.any(query, []).then((data) => {
			resolve(data);
		});
	});
};
// .use(async (req, res, next) => {
// 	console.log('CONSOLING../api/category/crud');
// 	console.log('cookie ' + req.cookies.authToken);
// 	const token = req.cookies.authToken;

// 	if (token === undefined) {
// 		next(Error('Not Logged in yet!'));
// 	} else {
// 		const isLogged = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
// 		console.log('cookie json:..' + JSON.stringify(isLogged));
// 		// if (isLogged.id === '') {
// 		// 	console.log('not admin');

// 		// }
// 		next();
// 	}
// })
