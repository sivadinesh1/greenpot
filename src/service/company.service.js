import prisma from '../db-config/prisma';
import { bigIntToString } from '../db-config/utils';
import { getDB } from '../db-config/db';
const { db } = getDB();
const { nanoid } = require('nanoid');

export const createCompnay = async (data) => {
	const { name } = data;
	console.log('test company name--->', name);
	let is_delete = 'N';
	let status = 'A';
	let result = null;
	try {
		result = await prisma.company.create({
			data: {
				company_id: nanoid(11),
				name: name,
				status: status,
				is_delete: is_delete,
			},
		});
	} catch (error) {
		console.log('createCompnay error::' + error.message);
	}
	return bigIntToString(result);
};

export const updateCompnay = async (data) => {
	const { id, name, status, about, logo, website_url } = data;
	let result = null;
	try {
		result = await prisma.company.update({
			where: {
				id: Number(id),
			},
			data: {
				name: name,
				status: status,
				about: about,
				logo: logo,
				website_url: website_url,
				updateddate: new Date(),
			},
		});
	} catch (error) {
		console.log('updateCompnay error::' + error.message);
	}
	return bigIntToString(result);
};

export const getById = async (id) => {
	let result = null;
	try {
		result = await prisma.company.findMany({
			where: {
				AND: [{ id: { equals: Number(id) || undefined } }, { is_delete: { equals: 'N' || undefined } }],
			},
		});
	} catch (error) {
		console.log('getById error::' + error.message);
	}
	return bigIntToString(result);
};

export const getByNano = async (id) => {
	let result = null;
	try {
		result = await prisma.company.findUnique({
			where: {
				company_id: id,
			},
		});
	} catch (error) {
		console.log('getByNano error::' + error.message);
	}
	return bigIntToString(result);
};

export const getByNanoWithAssociation = async (id) => {
	let result = null;
	try {
		result = await prisma.company.findUnique({
			where: {
				company_id: id,
			},
			include: {
				repo: {
					include: {
						blog: true,
					},
				},
			},
		});
	} catch (error) {
		console.log('getByNano error::' + error.message);
	}
	return bigIntToString(result);
};

export const getList = async () => {
	let result = null;
	try {
		result = await prisma.company.findMany({
			where: {
				is_delete: { equals: 'N' || null },
			},
			orderBy: {
				name: 'asc',
			},
		});
	} catch (error) {
		console.log('getList error::' + error.message);
	}
	return bigIntToString(result);
};

export const deleteById = async (id) => {
	const query1 = prisma.company.update({
		where: {
			id: Number(id),
		},
		data: {
			is_delete: 'Y',
		},
	});
	const query2 = prisma.repo.updateMany({
		where: {
			company_id: Number(id),
		},
		data: {
			status: 'H',
		},
	});
	const [deleteCompany, upadateRepo] = await prisma.$transaction([query1, query2]);
	console.log('test result ---->', upadateRepo);
	return bigIntToString(deleteCompany);
};

export const updateBlogFormat = async (id, data) => {
	let result = null;
	try {
		result = await prisma.company.update({
			where: {
				id: Number(id),
			},
			data: {
				blog_home_format: data,
			},
		});
	} catch (error) {
		console.log('update blog format error::' + error.message);
	}
	return bigIntToString(result);
};
