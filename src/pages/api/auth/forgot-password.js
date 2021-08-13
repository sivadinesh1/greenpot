import nextConnect from "next-connect";
import {getUserByEmail} from './common'
const mail = require('@sendgrid/mail');
const jwt=require('jsonwebtoken')
mail.setApiKey(process.env.SENDGRID_API_KEY);

export default nextConnect()
  .post(async (req, res) => {
      const {email} =req.body

      const user=await getUserByEmail(email);
      if(user == null)
       res.status(200).send({ email: email, message:"User Not Found" })
      else{
          console.log("test email in forgot password",email)
        //  await mail.send({
        //     from: 'sanmuganathan.yuvaraj@aalamsoft.com',
        //     to: 'sanmugamsanjai98@gmail.com',
        //     subject: 'Test MSG',
        //     text: 'Test message'
        //   }).then(() => {
        //     res.status(200).json({ status: 'Ok' });
        //   });
        const secret=process.env.JWT_SECRET
        const payload={
            id:user.id,
            salt:user.salt,
            email:user.email
        }

        const token=jwt.sign(payload,secret,{expiresIn:'10m'})
        const link=`${process.env.CLIENT_URL}/reset-password/${user.id}/${token}`
          res.status(200).send({ email: email,
        link:link})
      }

  });