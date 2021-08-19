import nc from 'next-connect';
import {createRepo} from '../../../service/repository.service'
const handler = nc().post(async(req,res)=>{
    const { name, status } = req.body;
    console.log("test repo request--->",req.body)
		const result = await createRepo(req.body);
		res.status(201).send(result);
})



export default handler;
