import nc from 'next-connect';

const slugify = require('slugify');
import { checkDuplicateNames, createTag, updateTag } from '../../../service/tag.service';

const handler = nc()
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
