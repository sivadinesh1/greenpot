import { getDB } from '../../dbconfig/db';
const { db } = getDB();
import crypto from "crypto";

export const passwordReset = async (password,id) =>{
    const salt1 = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt1, 1000, 64, "sha512")
      .toString("hex");
        
        return new Promise(function (resolve) {
            db.any('update users set salt=$1,hashed_password=$2 where id=$3 RETURNING id',[salt1,hash,id]).then((data) => {
                resolve({ message: 'success' });
            });
        });
}