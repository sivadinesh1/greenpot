import nc from 'next-connect';
// import { getCollection, deleteById, getAllCustomTemplates } from '../../../service/template-collection.service';
import { getLeadPageByRepo, updateBlock, deleteById } from '../../../service/lead-page.service';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;

		if (slug[0] === 'getById') {
			const result = await getCollection(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'getAll') {
			const result = await getAllCustomTemplates();
			res.status(200).json(result);
		} else if (slug[0] === 'repo') {
			const result = await getLeadPageByRepo(slug[1]);
			res.status(200).json(result);
		}
	})
	// delete
	.delete(async (req, res) => {
		const { slug } = req.query;
		const result = await deleteById(slug[0]);
		res.send({ result: 'success' });
	}).put(async (req, res) => {
		const { slug } = req.query;
		if (slug[0] === 'updateBlock') {
			const { id, block } = req.body;
			let result = await updateBlock(id, block);
			res.status(200).json(result);
		}
	});

export default handler;
