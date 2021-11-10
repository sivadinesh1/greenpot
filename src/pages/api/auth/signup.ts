import { checkEmailExists, insertUser } from '../../../service/auth/auth.service';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { setLoginSession } from '../../../middleware/auth';
import { createCompnay } from '../../../service/company.service';
import { createRepo } from '../../../service/repository.service';

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const { name, email, password, sub_domain, origin } = req.body;

	let isEmailExists = await checkEmailExists(email);

	if (isEmailExists !== null) {
		// return failure
		return res.json({ error: 'email taken', status: false });
	} else {
		const company = await createCompnay({ name, sub_domain });
		const data = await insertUser(name, email, password, origin, company.id);
		const repo = await createRepo({ repo_name: 'My Workspace', status: 'A', company_id: company.id, repo_type: "B", user_id: data.id });

		await setLoginSession(res, data);
		res.json({
			user: { first_name: name, email, password },
			data: data,
			status: true,
		});
	}
});
