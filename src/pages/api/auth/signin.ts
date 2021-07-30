import handler from '../handler';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import { checkEmailExists } from './common';


export default handler.post(async (req, res) => {
    const { email, password } = req.body;

    let user: any = await checkEmailExists(email);


    if (user !== 0) {
        if (await bcrypt.compare(password, user.hashed_password)) {

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
            const { id, username, name, email, role, companyid } = user;

            return res.json({
                token,
                user: { id, username, name, companyid, email, role },
            });

            // success
        } else {
            // failure
            res.json({ message: 'Password match failed' });
        }
    } else {
        res.json({ message: 'User Not Found' });
    }
});

