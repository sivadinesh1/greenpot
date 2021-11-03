import nc from 'next-connect';
import { getDefinition } from "../../../service/dictionary.service";

const handler = nc()
    .get(async (req, res) => {
        const { slug } = req.query;
        const result = await getDefinition(slug);
        res.status(200).json(result);
    });

export default handler;
