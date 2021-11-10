import nc from 'next-connect';
import { getById, getByNano, deleteById, updateBlogFormat, getByNanoWithAssociation, getBySubDomain } from '../../../service/company.service';

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
		} else if (slug[0] === 'getBySubDomain') {
			console.log("data test ---->", slug)
			const result = await getBySubDomain(slug[1]);
			console.log("data test ---->2", result)

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
