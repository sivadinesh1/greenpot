import { getDB } from '../../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
const { encryptPassword } = require('../../dbconfig/utils');
import crypto from 'crypto';


export const insertSubUser = async (data) => {
	const {name, email,companyId,accessRights} = data
	console.log("request body--->",data)
	let username = nanoid(11);
	let companyid = companyId;

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `U`;
    
    return new Promise(function (resolve) {
        db.one('INSERT INTO users(first_name, email, status, profile_url,companyid,access_rights,user_id) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id', [
            name,
            email,
            status,
            profile,
			companyid,
            accessRights,
            nanoid(11)
        ]).then((data) => {
            db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 2]).then((d) =>{

                resolve({ message: 'success',role:d.id,companyid:companyid,id:data.id });
            });
        });
    });
};