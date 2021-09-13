import nc from 'next-connect';
import { getById, getByTemplateName, getByNano, deleteById, search, searchTplByCat } from '../../../service/template.service';
import { auth } from '../../../middlewares/auth';
const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;
		console.log('test query data', slug);
		if (slug[0] === 'getById') {
			const result = await getById(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'getByNano') {
			const result = await getByNano(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'getByName') {
			const result = await getByTemplateName(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'search') {
			const result = await search(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'byCategory') {
			console.log('dinesh>>>');
			const result = await searchTplByCat(slug[1]);
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
