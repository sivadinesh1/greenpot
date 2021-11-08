import nc from 'next-connect';
import { updateLeadPageById, getCollection, checkDuplicate } from '../../../service/lead-page.service';
import { create } from "../../../service/lead-page.service";
import { getById } from '../../../service/template.service';
const slugify = require('slugify');


const handler = nc()
	.post(async (req, res) => {
		const { templateId, repoId, name, company_id } = req.body;
		const template = await getById(templateId);
		let slug = slugify(name).toLowerCase();
		let count = await checkDuplicate(slug);
		console.log("check data ---> ", count)

		if (template != null && !(count > 0)) {
			let request = {
				template_id: BigInt(templateId),
				repo_id: BigInt(repoId),
				blocks: template.blocks,
				thumbnail: template.thumbnail,
				name: name,
				company_id: BigInt(company_id),
				slug: slug
			};

			const result = await create(request);
			res.status(201).send(result);
		} else {
			res.status(200).json({ message: count > 0 ? 'Name already exist' : 'template not found' });
			return;
		}
	})
	.put(async (req, res) => {
		const { id, templateId, status, blocks, name } = req.body;
		//id validation
		const collection = await getCollection(id);
		let request = {
			id: id,
			template_id: templateId,
			status: status,
			name: name,
		};
		let template = null;

		if (Number(collection.template_id) === Number(templateId)) {
			request['blocks'] = blocks;
		} else {
			template = await getById(Number(templateId));
			request['blocks'] = template.blocks;
		}

		if (template != null || collection != null) {
			const result = await updateLeadPageById(request);
			res.status(200).send(result);
		} else {
			res.status(200).json({ message: 'template not found' });
			return;
		}
	});
export default handler;
