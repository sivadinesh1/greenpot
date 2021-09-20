import nc from 'next-connect';
import { getList, createRepo, updateRepo, checkDuplicateName } from '../../../service/repository.service';
import { auth } from '../../../middlewares/auth';
const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.companyid;
		const repos = await getList(company_id);

		res.status(200).json({ company_id, repos: repos || null });
	})
	.post(auth('getUsers'), async (req, res) => {
		let company_id = req.user.companyid;

		const { name, status ,repo_type} = req.body;
		const errors = [];

		const isdata = await checkDuplicateName(name, company_id);

		if (isdata > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		const result = await createRepo({ name, status, company_id ,repo_type});
		res.status(201).send(result);
	})
	.put(async (req, res) => {
		const result = await updateRepo(req.body);
		res.status(200).send(result);
	});

export default handler;
