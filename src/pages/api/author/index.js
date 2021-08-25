import nc from 'next-connect';
import {insertSubUser} from '../../../service/auth/subUser.service'
const mail = require('@sendgrid/mail');
mail.setApiKey(process.env.NEXT_PUBLIC_SG_SECRET_KEY);

const handler = nc().post(async(req,res)=>{
        const result = await insertSubUser(req.body);
        if(result.message === "success"){
            const email = await sendMail(req.body);
            console.log("test mail status---->",email)
            res.status(201).send(result);
        }
})
;

export default handler;


const sendMail =async (body) =>{
const {name, email,companyId} = body
    const msg = {
        to: 'sanmuganathan.yuvaraj@aalamsoft.com',
        from: 'sender@squapl.com',
        subject: 'Signup Test',
        text: 'Test',
        html: `<p><span><strong>Hi ${name},</strong></span><br><br>
        Click the link to signup<br><br>
        <span><strong>Thanks,</strong></span></p>`
      };
    	const data = await mail.send(msg).then(() => {
		    return { status: 'Ok' };
          });
          
        //   await mail.send(msg,(error, result) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log("That's wassup!");
        //     }
        //   });
// }
          return data;
}