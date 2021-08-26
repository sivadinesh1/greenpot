import nc from 'next-connect';
import { getAllCategories, deleteCategory } from '../../../service/category.service';

import { auth } from '../../../middlewares/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		const { company_id } = req.query;
		const returnValue = await getAllCategories(company_id);
		res.status(200).json(returnValue);
	})
	// delete
	.delete(async (req, res) => {
		const { company_id } = req.query;
		const result = await deleteCategory(company_id);
		res.send({ result: 'success' });
	});

export default handler;