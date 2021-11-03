import nc from 'next-connect';
import { getById, getByNano, deleteById, updateBlogFormat, getByNanoWithAssociation } from '../../../service/company.service';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(async (req, res) => {
		let company_id = 2;
		const { slug } = req.query;
		if (slug[0] === 'getById') {
			const result = await getById(company_id);
			res.status(200).json(result);
		} else if (slug[0] === 'getByNano') {
			const result = await getByNano(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'getByNanoWithAssociation') {
			const result = await getByNanoWithAssociation(slug[1]);
			res.status(200).json(result);
		}
	})
	.delete(async (req, res) => {
		const { slug } = req.query;
		console.log('delete method call--->', slug);
		const result = await deleteById(slug[0]);
		res.status(200).json(result);
	}).put(async (req, res) => {
		const { slug } = req.query;
		if (slug[0] === 'updateBlogFormat') {
			const { id, blogFormat } = req.body;
			const result = await updateBlogFormat(id, blogFormat);
			res.status(200).json(result);
		}
	});

export default handler;
