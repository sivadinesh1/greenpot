import nc from 'next-connect';
import { getById, getByNano, deleteById } from '../../../service/company.service';
import { auth } from '../../../middlewares/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.companyid;
		const { slug } = req.query;
		if (slug[0] === 'getById') {
			const result = await getById(company_id);
			res.status(200).json(result);
		} else if (slug[0] === 'getByNano') {
			const result = await getByNano(company_id);
			res.status(200).json(result);
		}
	})
	.delete(async (req, res) => {
		const { slug } = req.query;
		console.log('delete method call--->', slug);
		const result = await deleteById(slug[0]);
		res.status(200).json(result);
		// if (slug[0] === 'repo') {
		// 	const result = await deleteRepo(slug[1]);
		// 	res.status(200).json(result);
		// }
		// else if (slug[0] === 'company') {
		// 	const result = await deleteRepoByCompany(slug[1]);
		// 	res.status(200).json(result);
		// }
	});

export default handler;
