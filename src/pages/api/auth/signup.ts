import handler from '../handler';
import {checkEmailExists,insertUser} from './common'
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';



export default nextConnect<NextApiRequest, NextApiResponse>().post(async(req,res) =>{
    const { name, email, password,origin } = req.body;
    if ((await checkEmailExists(email)) !== 0) {
        // return failure
        return res.json({ error: 'email taken',status:false });
    } else {
        insertUser(name, email, password,origin);

        res.json({
            user: { name, email, password },
            status:true
        });
    }
    
})

