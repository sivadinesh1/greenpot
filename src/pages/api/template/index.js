import nc from 'next-connect';
import {create,updateTemplateById,getAllTemplates} from '../../../service/template.service'
const handler = nc()
.post(async(req,res)=>{
		const result = await create(req.body);
		res.status(201).send(result);
})
.put(async(req,res)=>{
		const result = await updateTemplateById(req.body);
		res.status(200).send(result);
 })
.get(async(req,res)=>{
    const result = await getAllTemplates();
		res.status(200).send(result);
})
;

export default handler;
