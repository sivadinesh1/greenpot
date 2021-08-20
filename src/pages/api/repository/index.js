import nc from 'next-connect';
import {createRepo,updateRepo,checkDuplicateName} from '../../../service/repository.service'
const handler = nc().post(async(req,res)=>{
    const {name,status,companyId}=req.body
        const errors = [];

		const isdata = await checkDuplicateName(name, companyId);

		if (isdata > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
        }
        
		const result = await createRepo(req.body);
		res.status(201).send(result);
})
.put(async(req,res)=>{
		const result = await updateRepo(req.body);
		res.status(200).send(result);
});



export default handler;
