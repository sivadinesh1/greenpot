import handler from '../handler';
import { bigIntToString } from '../../../dbconfig/utils';
import prisma from '../../../dbconfig/prisma';
const slugify = require('slugify');

export default handler
	// with parameters
	.get('/api/tag/crud/company/:id', async (req, res) => {
		const result = await getTag(req.params.id);
		const returnValue = bigIntToString(result);
		res.status(200).json(returnValue);
	})

	// default routes
	.get(async (req, res) => {
		const result = await prisma.tags.findMany({});

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

		const result = await prisma.tags.create({
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
	.delete('/api/tag/crud/:id', async (req, res) => {
		await prisma.tags.delete({
			where: {
				id: Number(req.params.id),
			},
		});
		res.send({ result: 'success' });
	})
	// update
	.put(async (req, res) => {
		const { name, tagid, companyid } = req.body;

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

		await prisma.tags.update({
			where: {
				id: Number(tagid),
			},
			data: {
				name: name,
				slug: slug,
				companyid: Number(companyid),
			},
		});
		res.status(200).send({ result: 'success' });
	});

const checkDuplicateNames = async (name, companyid) => {
	const result = await prisma.tags.count({
		where: {
			name: name,
			companyid: Number(companyid),
		},
	});
	return result;
};

// export const getAllTags = async () => {
// 	const result = await prisma.tags.findMany({});
// 	return bigIntToString(result);
// };

export const getAllTags = async (companyId) => {
	const result = await prisma.tags.findMany({
		where: {
			companyid: Number(companyId),
		},
		orderBy: {
			name: 'asc',
		},
	});

	return bigIntToString(result);
};

export const getTag = async (companyId) => {
	const result = await prisma.tags.findMany({
		where: {
			companyid: Number(companyId),
		},
		orderBy: {
			name: 'asc',
		},
	});

	return bigIntToString(result);
};
