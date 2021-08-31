import nc from 'next-connect';
import { getList, deleteRepo } from '../../../service/repository.service';

const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;
		const returnValue = await getList(slug);
		res.status(200).json(returnValue);
	})
	.delete(async (req, res) => {
		const { slug } = req.query;
		console.log('delete method call--->', slug);
		if (slug[0] === 'repo') {
			const result = await deleteRepo(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'company') {
			const result = await deleteRepo(slug[1]); // check its wrong
			res.status(200).json(result);
		}
	});

export default handler;
