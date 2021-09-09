import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { response } from './response.service'
// import {ApiResponse} from '../components/utils/ApiResponse'
import Codedescription from '../components/utils/Codedescription'
export const create = async (body) => {
	var resp = null;
	try {
		const { name, content } = body;
		let status = `A`;
		let isDelete = `N`;
		let date = new Date();
		let type = 'B';

		const result = await prisma.templates.create({
			data: {
				name: name,
				status: status,
				temp_id: nanoid(11),
				is_delete: isDelete,
				content: content,
				created_date: date,
				tpl_type: type,
			},
		});
		resp = response(true, 200, bigIntToString(result), "success")
	} catch (error) {
		resp = response(false, 500, "", error)
	}
	return resp;
};

export const updateTemplateById = async (updateBody) => {
	var resp = null;
	try {
		const { id, name, content, status } = updateBody;
		let date = new Date();
		let type = 'B';
		const result = await prisma.templates.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				status: status,
				content: content,
				updated_date: date,
				tpl_type: type,
			},
		});
		resp = response(true, 200, bigIntToString(result), "success")
	} catch (error) {
		resp = response(false, 500, "", error)
	}
	return resp;
};

export const getById = async (id) => {
	var resp = null;
	try {
		const result = await prisma.templates.findMany({
			where: {
				AND: [
					{
						id: {
							equals: BigInt(id),
						},
					},
					{
						is_delete: {
							equals: 'N',
						},
					},
				],
			},
		});
		resp = response(true, Codedescription.SUCCESS, bigIntToString(result.length > 0 ? result[0] : null), "success")
		// resp =new ApiResponse(true, 200, bigIntToString(result.length > 0 ? result[0] : null), "success")
	} catch (error) {
		resp = response(false, 500, "", error)
	}

	return resp;
};

export const getByTemplateName = async (name) => {
	let resp = null;
	try {
		const result = await prisma.templates.findMany({
			where: {
				AND: [
					{
						name: {
							equals: name,
						},
					},
					{
						is_delete: {
							equals: 'N',
						},
					},
				],
			},
		});

		resp = response(true, 200, bigIntToString(result.length > 0 ? result[0] : null), "success")
	} catch (error) {
		resp = response(false, 500, "", error)
	}
	return resp;
};
export const getByNano = async (name) => {
	var resp = null;
	try {
		const result = await prisma.templates.findMany({
			where: {
				AND: [
					{
						temp_id: {
							equals: name,
						},
					},
					{
						is_delete: {
							equals: 'N',
						},
					},
				],
			},
		});
		resp = response(true, 200, bigIntToString(result.length > 0 ? result[0] : null), "success")
	} catch (error) {
		resp = response(false, 500, "", error)
	}

	return resp;
};

export const getAllTemplates = async (req) => {
	let resp = null;
	try {
		let result = await prisma.templates.findMany({
			where: {
				is_delete: 'N',
			},
		});
		resp = response(true, 200, bigIntToString(result), "success")

	} catch (error) {
		console.log('error in getAllTemplates', JSON.stringify(error));
		resp = response(false, 500, "", error)
	}
	return resp;
};

export const deleteById = async (id) => {

	var resp = null;
	try {
		const result = await prisma.templates.update({
			where: { id: BigInt(id) },
			data: { is_delete: 'Y' },
		});
		resp = response(true, 200, bigIntToString(result), "success")

	} catch (error) {
		resp = response(false, 500, "", error)
	}

	return resp;
};
