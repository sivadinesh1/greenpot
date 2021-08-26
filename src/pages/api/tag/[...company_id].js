import nc from 'next-connect';
import { getAllTags, deleteTag } from '../../../service/tag.service';
import { auth } from '../../../middlewares/auth';
const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		const { company_id } = req.query;
		const returnValue = await getAllTags(company_id);
		res.status(200).json(returnValue);
	})
	// delete
	.delete(async (req, res) => {
		const { company_id } = req.query;
		const result = await deleteTag(company_id);
		res.send({ result: 'success' });
	});

export default handler;
