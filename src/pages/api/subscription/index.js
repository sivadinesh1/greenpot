import nc from 'next-connect';
import { createSubscription, checkDuplicateEmail } from "../../../service/subscriptioin.service";
const handler = nc()
    .post(async (req, res) => {
        const { email, company_id, lead_id } = req.body;
        const errors = [];
        const isdata = await checkDuplicateEmail(email, lead_id);

        if (isdata > 0) {
            console.log('Duplicate entry')
            errors.push('Duplicate entry');
            if (errors.length > 0) {
                res.status(200).json({ errors });
                return;
            }

        } else {
            let requestData = {
                email,
                company_id,
                lead_id,
            }

            const result = await createSubscription(requestData);
            res.status(201).send(result);
        }

    })
    ;

export default handler;
