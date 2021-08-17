import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const slugify = require('slugify');

export const getAllTags = async (company_id) => {
	const result = await prisma.tags.findMany({
		where: {
			companyid: Number(company_id),
		},
		orderBy: {
			name: 'asc',
		},
	});
	return bigIntToString(result);
};

export const deleteTag = async (company_id) => {
	const result = await prisma.tags.delete({
		where: {
			id: Number(company_id),
		},
	});
	return bigIntToString(result);
};

export const updateTag = async (name, tag_id, company_id) => {
	let slug = slugify(name).toLowerCase();

	const result = await prisma.tags.update({
		where: {
			id: Number(tag_id),
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
	const result = await prisma.tags.count({
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

export const getTags = async (ids) => {
	let query = `select * from tags t where t.id in (${ids})`;

	return new Promise(function (resolve) {
		db.any(query, []).then((data) => {
			resolve(data);
		});
	});
};

export const createTag = async (name, companyid) => {
	let slug = slugify(name).toLowerCase();

	const result = await prisma.tags.create({
		data: {
			name: name,
			slug: slug,
			companyid: Number(companyid),
		},
	});

	return bigIntToString(result);
};
