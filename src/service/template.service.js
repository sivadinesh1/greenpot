import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';


export const create = async (body) => {
    console.log("create templte method call----->", body)
    const { name, content } = body;
    let status = `A`;
    let isDelete = `N`;
    let date = new Date();
    let type = 'B'

    const result = await prisma.templates.create(
        {
            data: {
                name: name,
                status: status,
                temp_id: nanoid(11),
                is_delete: isDelete,
                content: JSON.stringify(content),
                created_date: date,
                tpl_type: type,
            }
        });
    result.content=JSON.parse(result.content)
    return bigIntToString(result);
}

export const updateTemplateById = async (updateBody) => {
    const { id, name, content, status } = updateBody;
    let date = new Date();
    let type='B'
    const result = await prisma.templates.update(
        {
            where:{
                id:id
            },
            data: {
                name: name,
                status: status,
                content: JSON.stringify(content),
                updated_date: date,
                tpl_type: type,
            }
        });
        result.content=JSON.parse(result.content)
        return bigIntToString(result);
 
};

export const getById = async (id) => {

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
                        equals: "N",
                    },
                },
            ]
        }
    })

    return bigIntToString(result.length > 0 ? result[0] : null);
}

export const getByTemplateName = async (name) => {

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
                        equals: "N",
                    },
                },
            ]
        }
    })

    return bigIntToString(result.length > 0 ? result[0] : null);
}
export const getByNano = async (name) => {


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
                        equals: "N",
                    },
                },
            ]
        }
    })

    return bigIntToString(result.length > 0 ? result[0] : null);

}

export const getAllTemplates =async (req) => {
    const result = await prisma.templates.findMany({
        where: {
                is_delete: "N",
        }
    })

    return bigIntToString(result);
}

export const deleteById = async (id) => {
    const result = await prisma.templates.update({
        where: { id: BigInt(id) },
        data: { is_delete: "Y" }
    });
    return bigIntToString(result);
}
