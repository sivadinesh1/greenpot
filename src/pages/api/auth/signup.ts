import handler from '../handler';
import {checkEmailExists,insertUser} from './common'


export default handler.post(async(req,res) =>{
    const { name, email, password,origin } = req.body;

    if ((await checkEmailExists(email)) !== 0) {
        // return failure
        return res.json({ error: 'email taken' });
    } else {
        insertUser(name, email, password,origin);

        res.json({
            user: { name, email, password },
        });
    }
    
})

