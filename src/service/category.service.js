import prisma from '../db-config/prisma';
import { bigIntToString } from '../db-config/utils';
import { getDB } from '../db-config/db';
const { db } = getDB();
const slugify = require('slugify');

export const getAllCategories = async (company_id) => {
	let result = [];
	try {
		result = await prisma.category.findMany({
			where: {
				company_id: Number(company_id),
			},
			orderBy: {
				name: 'asc',
			},
		});
	} catch (error) {
		console.log('getAllCategories error::' + error.message);
	}

	return bigIntToString(result);
};

export const deleteCategory = async (company_id) => {
	let result = null;
	try {
		result = await prisma.category.delete({
			where: {
				id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('deleteCategory error::' + error.message);
	}
	return bigIntToString(result);
};

export const updateCategory = async (name, category_id, company_id) => {
	let slug = slugify(name).toLowerCase();
	let result = null;
	try {
		result = await prisma.category.update({
			where: {
				id: Number(category_id),
			},
			data: {
				name: name,
				slug: slug,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('updateCategory error::' + error.message);
	}
	return bigIntToString(result);
};

export const checkDuplicateNames = async (name, company_id) => {
	let result = null;
	try {
		result = await prisma.category.count({
			where: {
				name: name,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('checkDuplicateNames error::' + error.message);
	}
	return result;
};

export const getAllBlog = async () => {
	let result = null;
	try {
		result = await prisma.blog.findMany({});
	} catch (error) {
		console.log('getAllBlog error::' + error.message);
	}
	return bigIntToString(result);
};

export const getCategories = async (ids) => {
	let query = `select * from category t where t.id in (${ids})`;

	return new Promise(function (resolve) {
		db.any(query, []).then((data) => {
			resolve(data);
		});
	});
};

export const createCategory = async (name, company_id) => {
	let slug = slugify(name).toLowerCase();
	let result = null;
	try {
		result = await prisma.category.create({
			data: {
				name: name,
				slug: slug,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('createCategory error::' + error.message);
	}
	return bigIntToString(result);
};

export const getCategoryWithTemplate = async () => {
	try {
		const result = await prisma.category.findMany({
			include: {
				template: true,
			},
		});

		let returnArr = result.filter((res) => {
			if (res.template.length > 0 && res != null) return res;
		});

		return bigIntToString(returnArr);
	} catch (error) {
		console.log('error in getCategoryWithTemplate', error.message);
	}
};
