import { getDB } from '../../dbconfig/db';
const { db } = getDB();
import crypto from "crypto";
import prisma from '../../dbconfig/prisma';
import { bigIntToString } from '../../dbconfig/utils';

export const passwordReset = async (password,id) =>{
    const salt1 = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt1, 1000, 64, "sha512")
      .toString("hex");
        
      const user = await prisma.users.update({
        where: {
            id: Number(id),
          },
        data: {
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

