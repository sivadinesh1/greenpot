import nc from 'next-connect';
import { getVerifiedAuthor, passwordReset, getAllAuthor } from '../../../service/auth/subUser.service';
import { setLoginSession } from '../../../middleware/auth';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;
		const { slug } = req.query;

		if (slug[0] === 'company') {
			const result = await getVerifiedAuthor(company_id);
			res.status(200).json(result);
		} else if (slug[0] === 'getAll') {
			const result = await getAllAuthor(company_id);
			res.status(200).json(result);
		}
	})
	.post(async (req, res) => {
		const { slug } = req.query;
		if (slug[0] === 'signup') {
			const result = await passwordReset(req.body);
			let obj = {
				id: result.id,
				company_id: result.company_id,
				role: 1,
			};
			await setLoginSession(res, obj);
			res.status(200).json(result);
		}
	});
export default handler;
