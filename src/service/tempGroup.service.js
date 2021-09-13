import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
const httpStatus = require('http-status');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { response } from './response.service';
import { ApiError } from '../components/utils/ApiError'
import Codedescription from '../components/utils/Codedescription';

export const create = async (body) => {
    var resp = null;
    try {
        console.log("test request data", body)
        const { name, description, tempList } = body;
        let status = `A`;
        let isDelete = `N`;
        let date = new Date();

        const result = await prisma.template_group.create({
            data: {
                name: name,
                status: status,
                description: description,
                is_delete: isDelete,
                created_date: date,
                template_maping: {
                    create: tempList
                }
            },
        });
        resp = bigIntToString(result);
        return resp;
    } catch (error) {
        console.log("test response--->", error)
        resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
    }
    return resp;
};

export const updateTempGroup = async (body) => {
    var resp = null;
    try {
        console.log("updateTempGroup request data", body)
        const { name, description, tempList, id, status } = body;

        if(tempList.length > 0)
        {
            await prisma.template_maping.deleteMany({
                where:{
                    group_id:BigInt(id)
                }
            })
        }

        let date = new Date();

        const result = await prisma.template_group.update({
            where: {
                id: id
            },
            data: {
                name: name,
                status: status,
                description: description,
                updated_date: date,
                template_maping: {
                    create: tempList
                }
            },
        });
        resp = bigIntToString(result);
        return resp;
    } catch (error) {
        console.log("test response--->", error)
        resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
    }
    return resp;
};

export const getAllTempGroup = async () => {
    var resp = null;
    try {
        console.log("get All request data")

        const result = await prisma.template_group.findMany({
            where: {
                is_delete: 'N'
            },
            include:{
                template_maping:true
            }
        });
        resp = bigIntToString(result);
        return resp;
    } catch (error) {
        console.log("test response--->", error)
        resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
    }
    return resp;
};

export const getTempGroupById = async (id) => {
    var resp = null;
    try {
        const result = await prisma.template_group.findMany({
            where: {
                is_delete: 'N',
                id:BigInt(id)
            },
            include:{
                template_maping:{
                    include:{
                        templates:true
                    }
                }
            }
        });
        resp = bigIntToString(result.length > 0 ? result[0] :[]);
        return resp;
    } catch (error) {
        console.log("test response--->", error)
        resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
    }
    return resp;
};

export const deleteById = async (id) => {
    var resp = null;
    try {
        const result = await prisma.template_group.update({
            where: {
                id: BigInt(id)
            },
            data: {
                is_delete: 'Y',
                }
        });
        resp = bigIntToString(result);
        return resp;
    } catch (error) {
        resp = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
    }
    return resp;
};