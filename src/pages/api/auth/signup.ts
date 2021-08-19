import handler from '../handler';
import {checkEmailExists,insertUser} from "../../../service/auth/auth.service";
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import {setLoginSession} from '../../../lib/auth'



export default nextConnect<NextApiRequest, NextApiResponse>().post(async(req,res) =>{
    const { name, email, password,origin } = req.body;
    if ((await checkEmailExists(email)) !== 0) {
        // return failure
        return res.json({ error: 'email taken',status:false });
    } else {
        
      const data=await insertUser(name, email, password,origin);
     await setLoginSession(res,data);
        res.json({
            user: { name, email, password },
            data:data,
            status:true
        });
    }
    
})

