import nc from 'next-connect';
import { createCtaSuggestion, getSuggestionByKey } from '../../../service/ctaSuggestion.service'

const handler = nc().get(async (req, res) => {
    const { slug } = req.query;
    const result = await getSuggestionByKey(slug);
    res.status(200).send(result);
});

export default handler;