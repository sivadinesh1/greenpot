import nc from 'next-connect';
import { getCustomTemp,deleteById } from '../../../service/customTemp.service';
const handler = nc()
	.get(async (req, res) => {
        const { slug } = req.query;
        console.log("test query data",slug)
		if (slug[0] === 'getById') {
			const result = await getCustomTemp(slug[1]);
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