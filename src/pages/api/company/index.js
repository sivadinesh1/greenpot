import nc from 'next-connect';
import {createCompnay,updateCompnay,getList} from '../../../service/company.service'
const handler = nc().post(async(req,res)=>{
		const result = await createCompnay(req.body);
		res.status(201).send(result);
})
.put(async(req,res)=>{
		const result = await updateCompnay(req.body);
		res.status(200).send(result);
}).get(async(req,res)=>{
    const result = await getList();
		res.status(200).send(result);
});



export default handler;