import { getDB } from '../../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
import crypto from 'crypto';


export const insertSubUser = async (data) => {
	const {name, email,companyId,accessRights} = data
	let username = nanoid(11);
	let companyid = companyId;

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `U`;
    
    return new Promise(function (resolve) {
        db.one('INSERT INTO users(first_name, email, status, profile_url,companyid,access_rights,user_id) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id,user_id', [
            name,
            email,
            status,
            profile,
			companyid,
            accessRights,
            nanoid(11)
        ]).then((data) => {
            db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1]).then((d) =>{

                resolve({ message: 'success',role:d.id,companyid:companyid,id:data.id,userId:data.user_id });
            });
        });
    });
};

export const getVerifiedAuthor = async (companyId) => {
    let status = `U`;
    let query =`select u.id ,u.first_name ,u.email ,u.created_by ,u.status,u.access_rights from users u where u.companyid =$1 and status != $2`
    
    return new Promise(function (resolve) {
        db.any(query,[companyId,status]).then((data) => {
            resolve(data);
        });
    });
};

export const passwordReset = async (body) =>{
    const {password,id}=body;
    const salt1 = crypto.randomBytes(16).toString("hex");
    let status='A';
    const hash = crypto
      .pbkdf2Sync(password, salt1, 1000, 64, "sha512")
      .toString("hex");
        
        return new Promise(function (resolve) {
            db.any('update users set salt=$1,hashed_password=$2,status=$3 where id=$4 RETURNING *',[salt1,hash,status,id]).then((data) => {
                resolve({ message: 'success',id:data[0].id,companyId:data[0].companyid });
            });
        });
}