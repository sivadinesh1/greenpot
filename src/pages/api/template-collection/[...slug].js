import nc from 'next-connect';
import { auth } from '../../../middleware/auth';
import { getTemplateCollectionById, deleteById } from '../../../service/template-collection.service';
const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;
		if (slug[0] === 'getById') {
			const result = await getTemplateCollectionById(slug[1]);
			res.status(200).json(result);
		}
	})
	// delete
	.delete(async (req, res) => {
		const { slug } = req.query;
		const result = await deleteById(slug[0]);
		res.send({ result: 'success' });
	});
export default handler;
