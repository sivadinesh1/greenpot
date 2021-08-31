import nc from 'next-connect';
import { getRepoSummary, getBlogsByCompany, createBlogEntry, getBlogById, getBlogsByRepo, getBlogByNanoId } from '../../../service/blog.service';
import { getList } from '../../../service/repository.service';
import { bigIntToString } from '../../../dbconfig/utils';
import { auth } from '../../../middlewares/auth';
import { isConstructSignatureDeclaration } from 'typescript';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.companyid;
		let user_id = req.user.id;

		const { slug } = req.query;

		if (slug[0] === 'company') {
			const result = await getBlogsByCompany(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'blogid') {
			const result = await getBlogById(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'blogByNano') {
			const result = await getBlogByNanoId(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'new') {
			const result = await createBlogEntry(company_id, slug[1], user_id);
			res.status(200).json(result);
		} else if (slug[0] === 'repo') {
			const result = await getBlogsByRepo(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'reposummary') {
			let arra1 = await getList(company_id);
			let arra2 = await getRepoSummary(company_id);

			let result = arra1.map((item) => {
				let item2 = arra2.find((i2) => i2.repo_id === item.id);
				return item2 ? { ...item, ...item2 } : item;
			});

			res.status(200).json(result);
		}
	})

	.delete(async (req, res) => {
		const { slug } = req.query;

		let blogId = Number(slug);

		const result = await prisma.blog.update({
			where: {
				id: blogId,
			},
			data: {
				isdelete: 'Y',
			},
		});

		var returnValue = bigIntToString(result);

		res.status(200).json(returnValue);
	});

export default handler;
