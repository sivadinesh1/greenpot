import { getDB } from '../db-config/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../db-config/prisma';
import { bigIntToString } from '../db-config/utils';

export const create = async (body) => {
	console.log('create custom templte method call----->', body);
	const { template_id, repo_id, blocks, name } = body;
	let status = `A`;
	let is_delete = `N`;
	let date = new Date();
	let type = 'B';

	let result = null;
	try {
		result = await prisma.lead_page.create({
			data: {
				template_id: template_id,
				status: status,
				lead_page_id: nanoid(11),
				blocks: blocks,
				is_delete: is_delete,
				repo_id: repo_id,
				createdAt: date,
				template_type: type,
				lead_page_name: name,
			},
		});
	} catch (error) {
		console.log('lead-page create error::' + error.message);
	}
	console.log('test custom temp', result);

	return bigIntToString(result);
};

export const updateTemplateById = async (updateBody) => {
	const { id, template_id, blocks, status, name } = updateBody;
	let date = new Date();

	let result = null;
	try {
		result = await prisma.lead_page.update({
			where: { id: id },
			data: {
				template_id: template_id,
				status: status,
				blocks: blocks,
				updatedAt: date,
				lead_page_name: name,
			},
			include: {
				repo: true,
			},
		});
	} catch (error) {
		console.log('updateTemplateById error::' + error.message);
	}
	return bigIntToString(result);
};

export const getCollection = async (id) => {
	let result = null;
	try {
		result = await prisma.lead_page.findMany({
			where: {
				AND: [
					{
						id: {
							equals: BigInt(id),
						},
						is_delete: {
							equals: 'N',
						},
					},
				],
			},
		});
	} catch (error) {
		console.log('getCollection error::' + error.message);
	}
	return bigIntToString(result.length > 0 ? result[0] : []);
};

export const getAllCustomTemplates = async () => {
	let result = null;
	try {
		result = await prisma.lead_page.findMany({
			where: {
				AND: [
					{
						is_delete: {
							equals: 'N',
						},
					},
				],
			},
		});
	} catch (error) {
		console.log('getAllCustomTemplates error::' + error.message);
	}
	return bigIntToString(result);
};

export const deleteById = async (id) => {
	let status = 'Y';
	let result = null;
	try {
		result = await prisma.lead_page.update({
			where: { id: BigInt(id) },
			data: {
				is_delete: status,
			},
		});
	} catch (error) {
		console.log('deleteById error::' + error.message);
	}
	return bigIntToString(result);
};

export const getCustomTempByNano = async (nanoid) => {
	var response = null;
	try {
		const result = await prisma.lead_page.findMany({
			where: {
				lead_page_id: nanoid,
				is_delete: 'N',
			},
			include: {
				repo: true,
			},
		});
		response = bigIntToString(result.length > 0 ? result[0] : []);
	} catch (error) {
		console.log('getCustomTempByNano :: ', error.message);
	}
	return response;
};

export const getLeadPageByRepo = async (id) => {
	var response = [];
	try {
		const result = await prisma.lead_page.findMany({
			where: {
				repo_id: BigInt(id),
				is_delete: 'N',
			},
		});
		response = bigIntToString(result);
	} catch (error) {
		console.log('getLeadPageByRepo ::', error.message);
	}
	return response;
};

//return count of templates/repo for given company_id
export const getCountLeadPageByRepo = async (company_id) => {
	let result = null;
	try {
		result = await prisma.lead_page.groupBy({
			by: ['repo_id'],
			_count: {
				id: true,
			},

			where: {
				company_id: Number(company_id),
				is_delete: 'N',
			},
		});
	} catch (error) {
		console.log('getCountLeadPageByRepo error::' + error.message);
	}
	let tempArr = bigIntToString(result);

	let returnArr = tempArr.map((e) => {
		return { repo_id: e.repo_id, count: e._count.id };
	});

	return returnArr;
};
