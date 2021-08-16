import nextConnect from 'next-connect';
import { getUserById } from '../../common';
const mail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
mail.setApiKey(process.env.SENDGRID_API_KEY);

export default nextConnect()
	.get('/api/auth/reset-password/:id/:token', async (req, res) => {
		const { id, token } = req.query;

		const user = await getUserById(id);
		if (user == null) res.status(200).send({ message: 'User Not Found' });
		else {
			try {
				const secret = process.env.JWT_SECRET;
				const user = jwt.verify(token, secret);
				res.status(200).json({ email: user.email });
			} catch (error) {
				res.status(200).send({ message: error.message });
			}
		}
	})
	.post(async (req, res) => {
		const { email } = req.body;

		const user = await getUserByEmail(email);
		if (user == null) res.status(200).send({ email: email, message: 'User Not Found' });
		else {
			//  await mail.send({
			//     from: 'sanmuganathan.yuvaraj@aalamsoft.com',
			//     to: 'sanmugamsanjai98@gmail.com',
			//     subject: 'Test MSG',
			//     text: 'Test message'
			//   }).then(() => {
			//     res.status(200).json({ status: 'Ok' });
			//   });
			const payload = {
				id: user.id,
				salt: user.salt,
				email: user.email,
			};

			const token = jwt.sign(payload, secret, { expiresIn: '10m' });
			const link = `${process.env.CLIENT_URL}/api/reset-password/${user.id}/${token}`;
			res.status(200).send({ email: email, link: link });
		}
	});
