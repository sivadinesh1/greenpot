import nc from 'next-connect';
import { getCustomTemp,deleteById,getAllCustomTemplates } from '../../../service/customTemp.service';
const handler = nc()
	.get(async (req, res) => {
        const { slug } = req.query;
		if (slug[0] === 'getById') {
			const result = await getCustomTemp(slug[1]);
			res.status(200).json(result);
		}else if(slug[0] === 'getAll') {
			const result = await getAllCustomTemplates();
			res.status(200).json(result);
        }
        
	})
	// delete
	.delete(async (req, res) => {
		const { slug } = req.query;
		const result = await deleteById(slug[0]);
		res.send({ result: 'success' });
	});

export default handler;