import nextConnect from "next-connect";
// import {getUserByEmail} from './common'
// const mail = require('@sendgrid/mail');
// const jwt=require('jsonwebtoken')
// mail.setApiKey(process.env.SENDGRID_API_KEY);
import { getDB } from '../../../dbconfig/db';
const { db } = getDB();
import crypto from "crypto";


export default nextConnect()
.post(async (req, res) => {
    const {password,id} =req.body
    const salt1 = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt1, 1000, 64, "sha512")
      .toString("hex");

db.one(	'update users set salt=$1,hashed_password=$2 where id=$3 RETURNING id',
			[salt1,hash,id],
		).then((data) => {
			res.status(200).send({ message: 'success' });
		});
});
//   .post(async (req, res) => {
//       const {email} =req.body

//       const user=await getUserByEmail(email);
//       if(user == null)
//        res.status(200).send({ email: email, message:"User Not Found" })
//       else{
//           console.log("test email in forgot password",email)
//         //  await mail.send({
//         //     from: 'sanmuganathan.yuvaraj@aalamsoft.com',
//         //     to: 'sanmugamsanjai98@gmail.com',
//         //     subject: 'Test MSG',
//         //     text: 'Test message'
//         //   }).then(() => {
//         //     res.status(200).json({ status: 'Ok' });
//         //   });
//         const secret=process.env.JWT_SECRET
//         const payload={
//             id:user.id,
//             salt:user.salt,
//             email:user.email
//         }

//         const token=jwt.sign(payload,secret,{expiresIn:'10m'})
//         const link=`${process.env.CLIENT_URL}/reset-password/${user.id}/${token}`
//           res.status(200).send({ email: email,
//         link:link})
//       }

//   });