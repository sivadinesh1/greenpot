import nc from 'next-connect';
import { createCtaSuggestion } from '../../../service/ctaSuggestion.service'

const handler = nc().post(async (req, res) => {
    const result = await createCtaSuggestion(req.body);
    res.status(201).send(result);
});

export default handler;