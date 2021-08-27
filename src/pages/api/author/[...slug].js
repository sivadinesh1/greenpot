import nc from 'next-connect';
import {getVerifiedAuthor,passwordReset,getAllAuthor } from '../../../service/auth/subUser.service';
import {setLoginSession} from '../../../middlewares/auth'

const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;

		if (slug[0] === 'company') {
			const result = await getVerifiedAuthor(slug[1]);
			res.status(200).json(result);
		}else if(slug[0] === 'getAll') {
			const result = await getAllAuthor(slug[1]);
			res.status(200).json(result);
		}
	}).post(async(req,res)=>{
		const { slug } = req.query;
		if (slug[0] === 'signup') {
			const result = await passwordReset(req.body);
			let obj={
				id:result.id,
				companyid:result.companyId,
				role:1
			}
			await setLoginSession(res,obj);
			res.status(200).json(result);
		}
	});
;

export default handler;