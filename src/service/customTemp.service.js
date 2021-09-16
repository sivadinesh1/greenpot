import { getDB } from '../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { ApiError } from '../components/utils/ApiError'
import Codedescription from '../components/utils/Codedescription';



export const create = async (body) => {
  console.log("create custom templte method call----->", body)
  const { template_id, repo_id, content, name } = body;
  let status = `A`;
  let isDelete = `N`;
  let date = new Date();
  let type = 'B'

  const result = await prisma.custom_template.create(
    {
      data: {
        template_id: template_id,
        status: status,
        ctemp_id: nanoid(11),
        content: content,
        is_delete: isDelete,
        repo_id: repo_id,
        created_date: date,
        tpl_type: type,
        name: name
      }
    });
  console.log("test custom temp", result)
  return bigIntToString(result);

}

export const updateTemplateById = async (updateBody) => {
  const { id, template_id, content, status, name } = updateBody;
  let date = new Date();

  const result = await prisma.custom_template.update(
    {
      where: { id: id },
      data: {
        template_id: template_id,
        status: status,
        content: content,
        updated_date: date,
        name: name
      },
      include: {
        repo: true,
      },
    });
  // result.content=JSON.parse(result.content)
  return bigIntToString(result);
};

export const getCustomTemp = async (id) => {

  const result = await prisma.custom_template.findMany({
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
    }
  });

  return bigIntToString(result.length > 0 ? result[0] : []);
}

export const getAllCustomTemplates = async () => {

  const result = await prisma.custom_template.findMany({
    where: {
      AND: [
        {
          is_delete: {
            equals: "N",
          },
        },
      ]
    }
  });

  return bigIntToString(result);
}

export const deleteById = async (id) => {

  let status = "Y"

  const result = await prisma.custom_template.update(
    {
      where: { id: BigInt(id) },
      data: {
        is_delete: status
      }
    });
  return bigIntToString(result);
}

export const getCustomTempByNano = async (nanoid) => {
  var response = null;
  try {
    const result = await prisma.custom_template.findMany({
      where: {
        ctemp_id: nanoid,
        is_delete: "N"
      },include:{
        repo:true
      }
    });
    response = bigIntToString(result.length > 0 ? result[0] : []);
  } catch (error) {
    console.log("Error Occured in Custom Template service", error.name);
    response = new ApiError(Codedescription.INTERNAL_SERVER_ERROR, 'prisma error');
  }
  return response;
}
