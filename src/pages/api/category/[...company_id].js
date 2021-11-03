import nc from 'next-connect';
// import { getAllCategories, deleteCategory, getCategoryWithTemplate, filter } from '../../../service/category.service';
import { getAllCategories, deleteCategory, getCategoryWithTemplate } from '../../../service/category.service';

import { auth } from '../../../middleware/auth';

const handler = nc()
	// auth('getUsers'),
	.get(async (req, res) => {
		const { company_id } = req.query;
		console.log('test cosole data', company_id);
		let returnValue = null;
		if (company_id[0] === 'getCatWithTemp') {
			returnValue = await getCategoryWithTemplate();
		}
		// else if (company_id[0] === 'search') {
		// 	returnValue = await filter(company_id[1]);
		// }
		else {
			returnValue = await getAllCategories(company_id[0]);
		}
		res.status(200).json(returnValue);
	})
	// delete
	.delete(async (req, res) => {
		const { company_id } = req.query;
		const result = await deleteCategory(company_id);
		res.send({ result: 'success' });
	});

export default handler;
