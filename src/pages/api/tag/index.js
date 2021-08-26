import nc from 'next-connect';

import { getAllTags, checkDuplicateNames, createTag, updateTag } from '../../../service/tag.service';
import { auth } from '../../../middlewares/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		console.log('ffdfffff');
		let company_id = req.user.companyid;

		const tags = await getAllTags(company_id);

		res.status(200).json({ company_id, tags });
	})
	// create method
	.post(async (req, res) => {
		const { name, companyid } = req.body;
		const errors = [];
		const isdata = await checkDuplicateNames(name, companyid);
		if (isdata > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}
		const result = await createTag(name, companyid);
		res.status(201).send(result);
	})

	// update
	.put(async (req, res) => {
		const { name, tagid, companyid } = req.body;

		const errors = [];

		const isdata = await checkDuplicateNames(name, companyid);

		if (isdata > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		const result = await updateTag(name, tagid, companyid);

		res.status(200).send({ result: 'success' });
	});

export default handler;
