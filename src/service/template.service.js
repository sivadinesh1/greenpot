import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { response } from './response.service';
import { ApiError } from '../components/utils/ApiError'
// import {ApiResponse} from '../components/utils/ApiResponse'
import Codedescription from '../components/utils/Codedescription';
export const create = async (body) => {
	var resp = null;
	try {
		const { name, content,tempGroupList ,category} = body;
		console.log("test data process---->",body)
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
				// categories:{category},
				template_maping:{
                    create: tempGroupList
				},
				
			}
		});
		resp = bigIntToString(result);
	} catch (error) {
		console.log("test prisma error",error)
		resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
	}
	return resp;
};

export const updateTemplateById = async (updateBody) => {
	var resp = null;
	try {
		const { id, name, content, status,tempGroupList } = updateBody;
		let date = new Date();
		let type = 'B';

		if(tempGroupList.length > 0)
        {
            await prisma.template_maping.deleteMany({
                where:{
                    temp_id:BigInt(id)
                }
            })
        }

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
				template_maping:{
                    create: tempGroupList.length > 0 ? tempGroupList : [],
				},
			},
		});
		resp = bigIntToString(result);
	} catch (error) {
		console.log("test prisma error",error)
		resp = response(false, 500, '', error);
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
		resp =  bigIntToString(result.length > 0 ? result[0] : null);
		// resp =new ApiResponse(true, 200, bigIntToString(result.length > 0 ? result[0] : null), "success")
	} catch (error) {
		resp = response(false, 500, '', error);
	}

	return resp;
};

export const getByTemplateName = async (name) => {
	let whereCondition = [
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
	];

	let resp = null;
	try {
		const result = await prisma.templates.findMany({
			where: {
				AND: whereCondition,
			},
		});

		resp = bigIntToString(result.length > 0 ? result[0] : null);
	} catch (error) {
		resp = response(false, 500, '', error);
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
		resp =  bigIntToString(result.length > 0 ? result[0] : null);
	} catch (error) {
		resp = response(false, 500, '', error);
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
		resp =bigIntToString(result);
	} catch (error) {
		console.log('error in getAllTemplates', JSON.stringify(error));
		resp = response(false, 500, '', error);
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

		return bigIntToString(result);
	} catch (error) {
		resp = response(false, 500, '', error);
	}
	return resp;
};

export const search = async (data) => {
	let resp = null;
	try {
		let result = await prisma.templates.findMany({
			where: {
				AND: [
					{
						name: {
							contains: data,
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

		return bigIntToString(result);
	} catch (error) {
		console.log('error in Search', JSON.stringify(error));
		resp = response(false, 500, '', error);
	}
};

export const searchTplByCat = async (category_id) => {
	console.log('dinesh ' + category_id);
	let resp = null;
	try {
		let result = await prisma.templates.findMany({
			where: {
				category_id: Number(category_id),
				is_delete: 'N',
			},
		});

		console.log('result *** ', bigIntToString(result));

		return bigIntToString(result);
	} catch (error) {
		console.log('error in searchTplByCat', JSON.stringify(error));
		resp = response(false, 500, '', error);
	}
};
