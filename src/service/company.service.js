import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');

export const createCompnay = async (data) => {
    const { name } = data
    console.log("test company name--->",name)
    let isdelete = "N"
    let status = "A"

    const result = await prisma.company.create({
        data: {
            company_id: nanoid(11),
            name: name,
            status: status,
            is_delete: isdelete,
            createddate: new Date()
        },
    });

    return bigIntToString(result);

};

export const updateCompnay = async (data) => {
    const { id, name, status, about, logo, website_url } = data

    const result = await prisma.company.update({
        where: {
            id: Number(id)
        },
        data: {
            name: name,
            status: status,
            about: about,
            logo: logo,
            website_url: website_url,
            updateddate: new Date()
        },
    });

    return bigIntToString(result);

};

export const getById = async (id) => {

    const result = await prisma.company.findMany({
        where: {
            AND: [{ id: { equals: Number(id) || undefined } }, { is_delete: { equals: 'N' || undefined } }],
        }

    });
    return bigIntToString(result);
    
};

export const getByNano = async (id) => {

    const result = await prisma.company.findUnique({
        where: {
             company_id: id 
        }
    });
    return bigIntToString(result);
};

export const getList = async () => {

    const result = await prisma.company.findMany({
        where: {
            is_delete: { equals: 'N' || null }
        },
        orderBy: {
            name: 'asc',
        },
    });
    return bigIntToString(result);
};

export const deleteById = async (id) => {

    const query1 = prisma.company.update({
        where: {
            id: Number(id)
        },
        data:{
            is_delete:"Y"
        }
    });
    const query2 =  prisma.repo.updateMany({
		where: {
			company_id: Number(id),
		},
		data: {
            status: 'H',
        }
        // ,
        // select:{
        //     id:id
        // }
    });
    const [deleteCompany,upadateRepo] = await prisma.$transaction([query1, query2])
    console.log("test result ---->",upadateRepo)
    return bigIntToString(deleteCompany);
};

