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
	getBlogsByCategory,
	deleteBlogById,
	updateViewCount
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
	})

	.delete(async (req, res) => {
		const { slug } = req.query;

		let response = await deleteBlogById(slug)

		res.status(200).json(response);
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
		} else if (slug[0] === 'updateViewCount') {
			let result = await updateViewCount(slug[1]);
			res.status(200).json(result);
		}

	});

export default handler;
