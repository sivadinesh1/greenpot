import nc from 'next-connect';
import {create,updateTempGroup,getAllTempGroup} from '../../../service/tempGroup.service'
const handler = nc()
.post(async(req,res)=>{
		const result = await create(req.body);
		res.status(201).send(result);
}).put(async(req,res)=>{
    const result = await updateTempGroup(req.body);
    res.status(200).send(result);
}).get(async(req,res)=>{
    const result = await getAllTempGroup();
		res.status(200).send(result);
})
;

export default handler;
