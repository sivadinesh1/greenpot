import nc from 'next-connect';
import {create,updateTemplateById, getCustomTemp} from '../../../service/customTemp.service'
import {getById} from '../../../service/template.service'

const handler = nc()
.post(async(req,res)=>{
        const {templateId,repoId,name}=req.body
        const template=await getById(templateId);

        if(template != null){
            let request={
                template_id:BigInt(templateId),
                repo_id:BigInt(repoId) ,
                content:template.content,
                name:name
            }

            const result = await create(request);
            res.status(201).send(result);
        }else{
            res.status(200).json({message:"template not found"});
				return;
        }
})
.put(async(req,res)=>{
        const {id,templateId,status,content,name}=req.body
        //id validation
        const customTemp=await getCustomTemp(id);
        let request={
            id:id,
            template_id:templateId,
            status:status ,
            name:name
        }
        let template=null;
        
        if(Number(customTemp.template_id) === Number(templateId)){
           request["content"] =content 
}        else{
            template=await getById(Number(templateId));
            request["content"] =template.content
        }

    
        if(template != null || customTemp != null){
            const result = await updateTemplateById(request);
            res.status(200).send(result);
        }else{
            res.status(200).json({message:"template not found"});
				return;
        }
 })
;

export default handler;
