import nc from 'next-connect';
import { insertSubUser } from '../../../service/auth/subUser.service';
const mail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
mail.setApiKey(process.env.NEXT_PUBLIC_SG_SECRET_KEY);

const handler = nc().post(auth('getUsers'), async (req, res) => {
	let user = req.user;
	const { name, email, accessRights } = req.body;

	const result = await insertSubUser({ name, email, companyId: user.company_id, accessRights });
	if (result.message === 'success') {
		req.body['userId'] = result.userId;
		req.body['id'] = result.id;
		const email = await sendMail(req.body);
		console.log('test mail status---->', email);
		res.status(201).send(result);
	}
});
export default handler;

const sendMail = async (body) => {
	const { name, email } = body;
	const link = await generateLink(body);
	const msg = {
		to: 'sanmuganathan.yuvaraj@aalamsoft.com',
		from: 'sender@squapl.com',
		subject: 'Signup Test',
		text: 'Test',
		html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${name},</strong></span><br><br>
        Click the link to signup<br><br>
        <p>${link}</p><br><br>
        <span><strong>Thanks,</strong></span></p></body></html>`,
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
	//<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><p><span><strong>Hi ${name},</strong></span><br><br>
	// <span><a href=${link}>Click</a></span>Click the link to signup<br><br>
	// <p>${link}</p><br><br>
	// <span><strong>Thanks,</strong></span></p></body></html>
	// }
	return data;
};

const generateLink = async (body) => {
	const secret = process.env.ACCESS_TOKEN_SECRET;
	const payload = {
		id: body.id,
		user_id: body.userId,
		email: body.email,
	};

	const token = jwt.sign(payload, secret, { expiresIn: '1d' });
	const link = `${process.env.CLIENT_URL}/author-signup/${body.userId}/${token}`;
	return link;
};
