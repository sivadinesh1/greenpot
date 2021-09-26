import nc from 'next-connect';
import { getRepos, createRepo, updateRepo, checkDuplicateRepoName } from '../../../service/repository.service';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;

		const repos = await getRepos(company_id);

		res.status(200).json(repos);
	})
	// add a new repo against a company
	.post(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;

		const { name: repo_name, status, repo_type } = req.body;

		const errors = [];

		const is_duplicate = await checkDuplicateRepoName(repo_name, company_id);

		if (+is_duplicate > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		const result = await createRepo({ repo_name, status, company_id, repo_type, user_id: req.user.id });
		res.status(201).send(result);
	})
	.put(async (req, res) => {
		const result = await updateRepo(req.body);
		res.status(200).send(result);
	});

export default handler;
