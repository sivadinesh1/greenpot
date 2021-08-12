import { getDB } from '../../../dbconfig/db';
const { db } = getDB();
const { nanoid } = require('nanoid');
const { encryptPassword } = require('../../../dbconfig/utils');
import crypto from "crypto";


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

export const insertUser = async (name, email, password,origin) => {
	let hashedpassword = await encryptPassword(password);
	const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
	let username = nanoid(11);

	let profile = `${process.env.CLIENT_URL}/profile/${username}`;
	let status = `A`;
	if(origin === 'lapa'){
        db.one('INSERT INTO users(first_name, email, hashed_password, salt, status, profile_url) VALUES($1, $2, $3, $4, $5,$6) RETURNING id', [
            name,
            email,
            hash,
            salt,
            status,
            profile,
        ])
            .then((data) => {
                db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1])
                // .then((data1) => {
                    //     console.log('user role inserted..');
                    // });
            })
    }
else{

	db.one('INSERT INTO users(first_name, email, hashed_password, status, profile_url) VALUES($1, $2, $3, $4, $5) RETURNING id', [
		name,
		email,
		hashedpassword,
		status,
		profile,
	]).then((data) => {
		db.one('INSERT INTO user_role(user_id, role_id) VALUES($1, $2) RETURNING id', [data.id, 1]);
		// .then((data1) => {

		// });
	});
}
};

// export const getUser =async (email) =>{
// 	let query='select * from users where email=$1'

// 	db.oneOrNone(query, [email]).then((data) => {
// 		console.log("data get success fully--->",data)
// 	});
// }


export const getUser = async ({email}) => {
	console.log("get user method call ---->",email)
	let query='select * from users where email=$1'

	return new Promise(function (resolve) {
		db.oneOrNone(query, [email]).then((data) => {
			console.log("data get success fully--->",data)
			resolve(data)
		});
	});
};

export const getUserByEmail = async (email) => {
	console.log("get user method call ---->",email)
	let query='select * from users where email=$1'

	return new Promise(function (resolve) {
		db.oneOrNone(query, [email]).then((data) => {
			console.log("data get success fully--->",data)
			resolve(data)
		});
	});
};
