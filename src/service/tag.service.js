import prisma from '../db-config/prisma';
import { bigIntToString } from '../db-config/utils';
import { getDB } from '../db-config/db';
const { db } = getDB();
const slugify = require('slugify');

export const getAllTags = async (company_id) => {
	let result = [];
	try {
		result = await prisma.tag.findMany({
			where: {
				company_id: Number(company_id),
			},
			orderBy: {
				name: 'asc',
			},
		});
	} catch (error) {
		console.log('getAllTags error :: ' + error.message);
	}
	return bigIntToString(result);
};

export const deleteTag = async (company_id) => {
	let result = null;
	try {
		result = await prisma.tag.delete({
			where: {
				id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('deleteTag error :: ' + error.message);
	}
	return bigIntToString(result);
};

export const updateTag = async (name, tag_id, company_id) => {
	let slug = slugify(name).toLowerCase();
	let result = null;
	try {
		result = await prisma.tag.update({
			where: {
				id: Number(tag_id),
			},
			data: {
				name: name,
				slug: slug,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('updateTag error :: ' + error.message);
	}
	return bigIntToString(result);
};

export const checkDuplicateNames = async (name, company_id) => {
	let result = null;
	try {
		result = await prisma.tag.count({
			where: {
				name: name,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('checkDuplicateNames error :: ' + error.message);
	}
	return result;
};

export const getAllBlog = async () => {
	let result = null;
	try {
		result = await prisma.blog.findMany({});
	} catch (error) {
		console.log('getAllBlog error :: ' + error.message);
	}
	return bigIntToString(result);
};

export const getTags = async (ids) => {
	// let query = `select * from tag t where t.id in (${ids})`;

	// return new Promise(function (resolve) {
	// 	db.any(query, []).then((data) => {
	// 		resolve(data);
	// 	});
	// });
	let result = null;
	try {
		result = await prisma.tag.findMany({
			where: {
				id: {
					in: ids,
				}
			}
		});
	} catch (error) {
		console.log('get tag error :: ' + error.message);
	}
	return bigIntToString(result);
};

export const createTag = async (name, company_id) => {
	let slug = slugify(name).toLowerCase();
	console.log('object...' + slug);
	console.log('object..cid.' + company_id);
	let result = null;
	try {
		result = await prisma.tag.create({
			data: {
				name: name,
				slug: slug,
				company_id: Number(company_id),
			},
		});
	} catch (error) {
		console.log('createTag error :: ' + error.message);
	}
	return bigIntToString(result);
};
