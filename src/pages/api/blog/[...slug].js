import nc from 'next-connect';
import {
	getRepoBlogSummary,
	getBlogsByCompany,
	validation,
	createBlogEntry,
	getBlogById,
	getBlogsByRepo,
	getBlogByNanoId,
	updateThumbnail,
	updateContent,
	updateLayout,
	getAllBlogs,
	publishBlog,
	updateTitle,
	updateAuthor,
	updateBlogDate,
	updateDescription,
	updateSlug,
	updateCategory,
	updateTag,
	getBlogsByCategory
} from '../../../service/blog.service';
import { getRepos } from '../../../service/repository.service';
import { bigIntToString } from '../../../db-config/utils';
import { auth } from '../../../middleware/auth';

const handler = nc()
	.get(auth('getUsers'), async (req, res) => {
		let company_id = req.user.company_id;

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
		} else if (slug[0] === 'category') {
			const result = await getBlogsByCategory(slug[1]);
			res.status(200).json(result);
		}
		// else if (slug[0] === 'getAll') {
		// 	const result = await getAllBlogs();
		// 	res.status(200).json(result);
		// }

		// else if (slug[0] === 'fetch-repos') {
		// 	let result = null;
		// 	try {
		// 		// check if the company has any repos
		// 		result = await getRepos(company_id);
		// 		if (repos.length > 0) {
		// 			let repo_blog_summary = await getRepoBlogSummary(company_id);
		// 			console.log('object.....' + JSON.stringify(repo_blog_summary));
		// 			//	let blog_count = await getRepoLeadPageSummary(company_id);
		// 		} else {
		// 			result = [];
		// 		}

		// 		// let arra2 = await getRepoSummary(company_id);

		// 		// if (arra1.length > 0 && arra2.length > 0) {
		// 		// 	result = arra1.map((item) => {
		// 		// 		let item2 = arra2.find((i2) => i2.repo_id === item.id);
		// 		// 		return item2 ? { ...item2, ...item } : item;
		// 		// 	});
		// 		// } else {
		// 		// 	result = [];
		// 		// }
		// 	} catch (error) {
		// 		console.log('error in blog route slug ' + error.message);
		// 	}
		// 	console.log('test repo result', result);
		// 	res.status(200).json(result);
		// }
	})

	.delete(async (req, res) => {
		const { slug } = req.query;

		let blogId = Number(slug);

		const result = await prisma.blog.update({
			where: {
				id: blogId,
			},
			data: {
				is_delete: 'Y',
			},
		});

		var returnValue = bigIntToString(result);

		res.status(200).json(returnValue);
	}).put(async (req, res) => {
		const { slug } = req.query;
		if (slug[0] === 'updateThumb') {
			const { id, thumbnail } = req.body;
			const result = await updateThumbnail(id, thumbnail);
			res.status(200).json(result);
		} else if (slug[0] === 'updateContent') {
			const { id, content } = req.body;
			const result = await updateContent(id, content);
			res.status(200).json(result);
		} else if (slug[0] === 'updateLayout') {
			const { id, layout } = req.body;
			const result = await updateLayout(id, layout);
			res.status(200).json(result);
		} else if (slug[0] === 'publish') {
			let resp = await validation(req.body.blog_id)
			if (resp.isError) {
				res.status(200).json(resp);
			} else {
				const result = await publishBlog(req.body);
				result["isError"] = false;
				res.status(200).json(result);
			}
		} else if (slug[0] === 'autoSaveTitle') {
			const { id, title } = req.body
			const result = await updateTitle(id, title);
			res.status(200).json(result);
		} else if (slug[0] === 'autoSaveDescription') {
			const { id, description } = req.body
			const result = await updateDescription(id, description);
			res.status(200).json(result);
		} else if (slug[0] === 'autoSaveAuthor') {
			const { id, author } = req.body
			const result = await updateAuthor(id, author);
			res.status(200).json(result); updateSlug
		} else if (slug[0] === 'autoSaveBlogDate') {
			const { id, blogDate } = req.body
			console.log("check server side data--->", req.body)
			const result = await updateBlogDate(id, blogDate);
			res.status(200).json(result);
		} else if (slug[0] === 'autoSaveSlug') {
			const { id, slug } = req.body
			const result = await updateSlug(id, slug);
			res.status(200).json(result);
		} else if (slug[0] === 'autoSaveCategory') {
			const { id, category } = req.body
			console.log("check vale in catarray", category)
			const result = await updateCategory(id, category);
			res.status(200).json(result);
		} else if (slug[0] === 'autoSaveTag') {
			const { id, tag } = req.body
			const result = await updateTag(id, tag);
			res.status(200).json(result);
		}

	});

export default handler;
