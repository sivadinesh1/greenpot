import { getDB } from '../../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
const { encryptPassword } = require('../../dbconfig/utils');
import crypto from 'crypto';

export const checkEmailExists = (email) => {
	let query = ` select u.*, r.name as role_name, r.description as role_desc,
ur.role_id as role
    from 
    users u,
    role r,
    user_role ur
    where
    u.id = ur.user_id and
    ur.role_id = r.id and email = $1 `;

	return new Promise(function (resolve) {
		db.oneOrNone(query, email).then((user) => {
			if (user) {
				resolve(user); // user found
			} else {
				resolve(0); // null, user not found
			}
		});
		// .catch((error) => {
		//     // something went wrong;
		// });
	});
};

export const checkIdExists = (id) => {
	let query = ` select u.*, r.name as role_name, 
    r.description as role_desc,
    ur.role_id as role
    from 
    users u,
    role r,
    user_role ur
    where
    u.id = ur.user_id and
    ur.role_id = r.id and id = $1 `;

	return new Promise(function (resolve) {
		db.oneOrNone(query, id).then((user) => {
			if (user) {
				resolve(user); // user found
			} else {
				resolve(0); // null, user not found
			}
		});
		// .catch((error) => {
		//     // something went wrong;
		// });
	});
};

export const insertUser = async (name, email, password, origin,companyId) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	let username = nanoid(11);
	let companyid = companyId;
	let accessRights='A';

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `A`;

	// db.one('INSERT INTO users(first_name, email, hashed_password, salt, status, profile_url,companyid) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id', [
	// 	name,
	// 	email,
	// 	hash,
	// 	salt,
	// 	status,
	// 	profile,
	// 	companyid,
	// ]).then((data) => {
	// 	db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1]).then((data) =>{

    //     });
    // });
    
    return new Promise(function (resolve) {
        db.one('INSERT INTO users(first_name, email, hashed_password, salt, status, profile_url,companyid,access_rights,user_id) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9) RETURNING id', [
            name,
            email,
            hash,
            salt,
            status,
            profile,
			companyid,
			accessRights,
			nanoid(11)
        ]).then((data) => {
            db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1]).then((d) =>{

                resolve({ message: 'success',role:d.id,companyid:companyid,id:data.id });
            });
        });
    });
};

export const getUser = async ({ email }) => {
	let query = 'select * from users where email=$1';

	return new Promise(function (resolve) {
		db.oneOrNone(query, [email]).then((data) => {
			resolve(data);
		});
	});
};

export const getUserByEmail = async (email) => {
    // let query = 'select * from users where email=$1';
    let query=`select u.*, r.name as role_name, r.description as role_desc,
    ur.role_id as role
        from 
        users u,
        role r,
        user_role ur
        where
        u.id = ur.user_id and
        ur.role_id = r.id and email =$1`

	return new Promise(function (resolve) {
		db.oneOrNone(query, [email]).then((data) => {
			resolve(data);
		});
	});
};

export const getUserById = async (id) => {
	let query = 'select * from users where id=$1';

	return new Promise(function (resolve) {
		db.oneOrNone(query, [id]).then((data) => {
			resolve(data);
		});
	});
};

export const getUserByNano = async (id) => {
	let query = 'select * from users where user_id=$1';

	return new Promise(function (resolve) {
		db.oneOrNone(query, [id]).then((data) => {
			resolve(data);
		});
	});
};
