import nc from 'next-connect';
import { getRepos, deleteRepo } from '../../../service/repository.service';

import { getCountLeadPageByRepo } from '../../../service/lead-page.service';

import { getCountBlogPageByRepo } from '../../../service/blog.service';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		const { slug } = req.query;

		try {
			let company_id = req.user.company_id;

			if (slug[0] === 'fetch-repos-summary') {
				let repoList = null;
				let repoLeadPagesSummary = null;
				let repoBlogPagesSummary = null;

				// check if the company has any repos
				repoList = await getRepos(company_id);
				repoLeadPagesSummary = await getCountLeadPageByRepo(company_id);
				repoBlogPagesSummary = await getCountBlogPageByRepo(company_id);

				if (repoList.length > 0) {
					repoList.forEach((repo) => {
						let temp = repoLeadPagesSummary.find((leadPage) => leadPage.repo_id === repo.id);
						repo.lead_pages_count = temp ? temp.count : 0;
					});

					repoList.forEach((repo) => {
						let temp = repoBlogPagesSummary.find((blogPage) => blogPage.repo_id === repo.id);
						repo.blog_pages_count = temp ? temp.count : 0;
					});

					res.status(200).json(repoList);
				} else {
					res.status(200).json([]);
				}
			}
		} catch (error) {
			console.log('fetch-repos-summary error :: ' + error.message);
		}
	})
	.delete(async (req, res) => {
		const { slug } = req.query;
		console.log('delete method call--->', slug);
		if (slug[0] === 'repo') {
			const result = await deleteRepo(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'company') {
			const result = await deleteRepo(slug[1]); // check its wrong
			res.status(200).json(result);
		}
	});

export default handler;
