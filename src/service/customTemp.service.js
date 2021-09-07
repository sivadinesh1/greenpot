import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';

export const create = async (body) => {
    console.log("create custom templte method call----->", body)
    const { template_id, repo_id ,content} = body;
    let status = `A`;
    let isDelete = `N`;
    let date=new Date();
    let type = 'B'

    const result = await prisma.custom_template.create(
        {
            data: {
                template_id:template_id,
                status: status,
                ctemp_id: nanoid(11),
                content: JSON.stringify(content),
                is_delete: isDelete,
                repo_id:repo_id,
                created_date: date,
                tpl_type: type,
            }
        });
    result.content=JSON.parse(result.content)
    console.log("test custom temp",result)
    return bigIntToString(result);

  }
  
  export const updateTemplateById = async (updateBody) => {
    const { id, template_id ,content, status } = updateBody;
    let date=new Date();

    const result = await prisma.custom_template.update(
        {
            where:{id:id},
            data: {
                template_id:template_id,
                status: status,
                content: JSON.stringify(content),
                updated_date: date
            },
            include: {
                repo: true, 
            },
        });
    result.content=JSON.parse(result.content)
    return bigIntToString(result);
  };
  
  export const getCustomTemp = async(id) => {

    const result=await prisma.custom_template.findMany({
        where: {
          AND: [
            {
                id: {
                    equals: BigInt(id),
                  },
              is_delete: {
                equals: "N",
              },
            },
          ]
        }});

        return bigIntToString(result.length > 0 ? result[0] : []);
  }
  
  export const getAllCustomTemplates =async () => {

    const result=await prisma.custom_template.findMany({
        where: {
          AND: [
            {
              is_delete: {
                equals: "N",
              },
            },
          ]
        }});

        return bigIntToString(result);
  }
  
  export const deleteById =async (id) => {

    let status="Y"

    const result = await prisma.custom_template.update(
        {
            where:{id:BigInt(id)},
            data: {
                is_delete:status
            }
        });
    return bigIntToString(result);
  }
  