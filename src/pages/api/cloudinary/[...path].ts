import {NextApiRequest, NextApiResponse} from 'next';
import { getISODay } from 'date-fns';
const cloudinary = require("cloudinary").v2;


export default function generateSignature(req:NextApiRequest,res:NextApiResponse){
    const timestamp = Math.round(new Date().getTime() / 1000);
    let path=`${req.query.path[0]}/${req.query.path[1]}/`;
    const signature = cloudinary.utils.api_sign_request(
        {
            folder:path,
            timestamp: timestamp,
        },
        process.env.CLOUDINARY_SECRET
    );  

    res.statusCode = 200;
    res.json({ signature, timestamp });
}


cloudinary.config({
 cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // add your cloud_name
 api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY, // add your api_key
 api_secret: process.env.CLOUDINARY_SECRET, // add your api_secret
 secure: true
});



  export const getImages = async(path)=>{
    const data=cloudinary.search.expression(
        `folder:${path}/*` // add your folder
        ).sort_by('public_id','desc').max_results(5).execute().then(result=>{console.log(result)
        return result.resources});
        return data;
  }