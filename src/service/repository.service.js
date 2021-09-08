import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');

export const createRepo = async (data) => {
	let isdelete = 'N';

	const result = await prisma.repo.create({
		data: {
			repo_id: nanoid(11),
			name: data.name,
			company_id: Number(data.company_id),
			status: data.status,
			isdelete: isdelete,
			createddate: new Date(),
		},
	});

	return bigIntToString(result);

	// let query1=`INSERT INTO repo (repo_id,name,company_id,status,isdelete,createddate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`

	// return new Promise(function (resolve,reject) {
	// 	db.any(query1, [nanoid(11),name,companyId,status,isdelete,new Date()]).then((data) => {
	// 		resolve(data);
	// 	}).catch((error)=>{
	//         reject(error)
	//     })

	// });
};

export const updateRepo = async (data) => {
	const { name, status, id } = data;
	const result = await prisma.repo.update({
		where: {
			id: Number(id),
		},
		data: {
			name: name,

			status: status,
			updateddate: new Date(),
		},
	});

	return bigIntToString(result);
};

export const deleteRepo = async (id) => {
	const query1 = prisma.repo.update({
		where: {
			id: Number(id),
		},
		data: {
			isdelete: 'Y',
		},
	});

	const query2 = prisma.blog.updateMany({
		where: {
			repo_id: Number(id),
		},
		data: {
			status: 'H',
			published: 'S',
		},
	});
	const query3 = prisma.custom_template.updateMany({
		where: {
			repo_id: Number(id),
		},
		data: {
			status: 'H',
		},
	});

	const [deleteRepo, upadateBlog,updateCTemp] = await prisma.$transaction([query1, query2,query3]);

	return bigIntToString(deleteRepo);
};

export const getList = async (id) => {

	const result = await prisma.repo.findMany({
		where: {
			AND: [{ company_id: { equals: Number(id) || undefined } }, { isdelete: { equals: 'N' || undefined } }],
		},
		orderBy: {
			name: 'asc',
		},
		include:{
			custom_template:true
		}
		
	});
	return bigIntToString(result);
};

export const checkDuplicateName = async (name, companyId) => {
	const result = await prisma.repo.count({
		where: {
			name: name,
			company_id: Number(companyId),
		},
	});

	return result;
};

export const getRepo = async (id) => {
	const result = await prisma.repo.findUnique({
		where: {
			id: Number(id),
		},
	});
	return bigIntToString(result);
};

export const getRepoByNano = async (id) => {
	const result = await prisma.repo.findUnique({
		where: {
			repo_id: id,
		},
	});
	return bigIntToString(result);
};
