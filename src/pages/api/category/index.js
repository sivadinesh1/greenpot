import nc from 'next-connect';
import { auth } from '../../../middleware/auth';

const slugify = require('slugify');
import { getAllCategories, checkDuplicateNames, createCategory, updateCategory } from '../../../service/category.service';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;
		const categories = await getAllCategories(company_id);

		res.status(200).json({ company_id, categories });
	})
	// create method
	.post(async (req, res) => {
		const { name, company_id } = req.body;
		const errors = [];
		const isdata = await checkDuplicateNames(name, company_id);
		if (isdata > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}
		const result = await createCategory(name, company_id);
		res.status(201).send(result);
	})

	// update
	.put(async (req, res) => {
		const { name, categoryid, company_id } = req.body;

		const errors = [];

		const isdata = await checkDuplicateNames(name, company_id);

		if (isdata > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		const result = await updateCategory(name, categoryid, company_id);

		res.status(200).send({ result: 'success' });
	});

export default handler;
