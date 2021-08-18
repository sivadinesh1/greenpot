import nextConnect from "next-connect";
import {passwordReset} from '../../../service/auth/reset.service'


export default nextConnect()
.post(async (req, res) => {
    const {password,id} =req.body
const result=await passwordReset(password,id);
res.status(200).send(result);
});
