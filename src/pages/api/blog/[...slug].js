import nc from 'next-connect';
import { getBlogsByCompany, createBlogEntry, getBlogById,getBlogsByRepo } from '../../../service/blog.service';

const handler = nc()
	.get(async (req, res) => {
		const { slug } = req.query;

		if (slug[0] === 'company') {
			const result = await getBlogsByCompany(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'blogid') {
			const result = await getBlogById(slug[1]);
			res.status(200).json(result);
		} else if (slug[0] === 'new') {
			const result = await createBlogEntry(slug[1],slug[2]);
			res.status(200).json(result);
		}else if (slug[0] === 'repo') {
			const result = await getBlogsByRepo(slug[1]);
			res.status(200).json(result);
		}
	})

	// default routes
	// .get(async (req, res) => {
	// 	const result = await prisma.categories.findMany({});

	// 	const returnValue = bigIntToString(result);
	// 	res.status(200).json(returnValue);
	// })

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

		res.send(returnValue);
	});

export default handler;

// // with parameters - new dummy entry
// .post(async (req, res) => {
// 	const { company_id } = req.query;
// 	const result = await createBlogEntry(company_id);

// 	const returnValue = bigIntToString(result);
// 	res.status(200).json(returnValue);
// });
