import nc from 'next-connect';
import { updateTemplateById, getCollection } from '../../../service/template-collection.service';
import { create } from "../../../service/lead-page.service";
import { getById } from '../../../service/template.service';

const handler = nc()
	.post(async (req, res) => {
		const { templateId, repoId, name, company_id } = req.body;
		const template = await getById(templateId);

		if (template != null) {
			let request = {
				template_id: BigInt(templateId),
				repo_id: BigInt(repoId),
				blocks: template.blocks,
				name: name,
				company_id: BigInt(company_id)
			};

			const result = await create(request);
			res.status(201).send(result);
		} else {
			res.status(200).json({ message: 'template not found' });
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
			const result = await updateTemplateById(request);
			res.status(200).send(result);
		} else {
			res.status(200).json({ message: 'template not found' });
			return;
		}
	});
export default handler;
