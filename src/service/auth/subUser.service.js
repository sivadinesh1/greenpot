import { getDB } from '../../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import crypto from 'crypto';
import prisma from '../../dbconfig/prisma';
import { bigIntToString } from '../../dbconfig/utils';


export const insertSubUser = async (data) => {
	const {name, email,companyId,accessRights} = data
	let username = nanoid(11);
	let companyid = companyId;

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let status = `U`;
    

    const user = await prisma.users.create({
        data: {
            first_name:name,
          email: email,
          status:status,
          profile_url:profile,
          companyid:Number(companyid),
          access_rights:accessRights,
          user_id: nanoid(11),
          user_role: {
            create: [
              { role_id: 1 }
              
            ],
          },
        },
        include: {
            user_role: true, // users all user_role in the returned object
        },
      })
      const returnValue=bigIntToString(user);

      let returnObj={ 
          message: 'success',
          id:returnValue.id,
          userId:returnValue.user_id,
          role:returnValue.user_role[0].role_id,
          companyid:returnValue.companyid 
        };

      return returnObj;
};

export const getVerifiedAuthor = async (companyId) => {
    let status = `U`;
    
    const authors = await prisma.users.findMany({
        where: {
            AND: [{ companyid: { equals: Number(companyId) || undefined } }, { status: { equals: 'A' || 'I' } }],
        },
        select:{
            id: true,
            first_name: true,
            email: true,
            status: true,
            access_rights: true,
        }
      })
      const returnValue=bigIntToString(authors);
      return returnValue;
};

export const getAllAuthor = async (companyId) => {
    let status = `U`;
    
    const authors = await prisma.users.findMany({
        where: {
            companyid: Number(companyId)
        }
      })
      const returnValue=bigIntToString(authors);
      return returnValue;
};

export const passwordReset = async (body) =>{
    const {password,id}=body;
    const salt1 = crypto.randomBytes(16).toString("hex");
    let status='A';
    const hash = crypto
      .pbkdf2Sync(password, salt1, 1000, 64, "sha512")
      .toString("hex");

      const user = await prisma.users.update({
        where: {
            id: Number(id),
          },
        data: {
          status:status,
          salt:salt1,
          hashed_password:hash
        },
        select:{
            id: true,
            companyid: true
           
        }
      });
      const returnValue=bigIntToString(user);
      return { message: 'success',id:returnValue.id,companyId:returnValue.companyid };
}