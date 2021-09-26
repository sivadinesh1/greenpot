import nc from 'next-connect';

import { getAllTags, checkDuplicateNames, createTag, updateTag } from '../../../service/tag.service';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;

		const tags = await getAllTags(company_id);

		res.status(200).json({ company_id, tags });
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
		const result = await createTag(name, company_id);
		res.status(201).send(result);
	})

	// update
	.put(async (req, res) => {
		const { name, tag_id, company_id } = req.body;

		const errors = [];

		const is_data = await checkDuplicateNames(name, company_id);

		if (is_data > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		const result = await updateTag(name, tag_id, company_id);

		res.status(200).send({ result: 'success' });
	});

export default handler;
