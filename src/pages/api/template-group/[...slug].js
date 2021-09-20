import nc from 'next-connect';
import { auth } from '../../../middlewares/auth';
import {getTempGroupById,deleteById} from '../../../service/tempGroup.service'
const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;
		console.log('test query data', slug);
		if (slug[0] === 'getById') {
			const result = await getTempGroupById(slug[1]);
			res.status(200).json(result);
		} 
	})
	// delete
	.delete(async (req, res) => {
		const { slug } = req.query;
		const result = await deleteById(slug[0]);
		res.send({ result: 'success' });
    })
    ;

export default handler;
