import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const slugify = require('slugify');

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

export const deleteCategory = async (company_id) => {
	const result = await prisma.categories.delete({
		where: {
			id: Number(company_id),
		},
	});
	return bigIntToString(result);
};

export const updateCategory = async (name, category_id, company_id) => {
	let slug = slugify(name).toLowerCase();

	const result = await prisma.categories.update({
		where: {
			id: Number(category_id),
		},
		data: {
			name: name,
			slug: slug,
			companyid: Number(company_id),
		},
	});
	return bigIntToString(result);
};

export const checkDuplicateNames = async (name, companyid) => {
	const result = await prisma.categories.count({
		where: {
			name: name,
			companyid: Number(companyid),
		},
	});

	return result;
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

export const createCategory = async (name, companyid) => {
	let slug = slugify(name).toLowerCase();

	const result = await prisma.categories.create({
		data: {
			name: name,
			slug: slug,
			companyid: Number(companyid),
		},
	});

	return bigIntToString(result);
};
