import nc from 'next-connect';
import { create, updateTempGroup, getAllTemplatesInCollection } from '../../../service/template-collection.service';
const handler = nc()
	.post(async (req, res) => {
		const result = await create(req.body);
		res.status(result.statusCode === 500 ? 500 : 201).send(result);
	})
	.put(async (req, res) => {
		const result = await updateTempGroup(req.body);
		res.status(200).send(result);
	})
	.get(async (req, res) => {
		const result = await getAllTemplatesInCollection();
		res.status(200).send(result);
	});
export default handler;
