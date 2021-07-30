import handler from '../handler';
import { bigIntToString } from '../../../dbconfig/utils';
import prisma from '../../../dbconfig/prisma';

export default handler
	// without parameters
	.get('/api/blog/crud/users', async (req, res) => {
		res.status(200).json({ title: 'John Doe 2' });
	})

	// with parameters
	.get('/api/blog/crud/company/:id', async (req, res) => {
		const result = await getBlogsByCompany(req.params.id);

		const returnValue = bigIntToString(result);
		res.status(200).json(returnValue);
	})

	// default routes
	.get(async (req, res) => {
		const result = await prisma.categories.findMany({});

		const returnValue = bigIntToString(result);
		res.status(200).json(returnValue);
	})
	.delete('/api/blog/crud/:id', async (req, res) => {
		let blogId = Number(req.params.id);

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

// const checkDuplicateTitles = async (title, companyid) => {
//     const result = await prisma.blog.count({
//         where: {
//             title: title,
//             companyid: Number(companyid),
//         }

//     })
//     return result;
// }

export const getAllBlogs = async () => {
	const result = await prisma.blog.findMany({});
	return bigIntToString(result);
};

export const getBlogsByCompany = async (companyId) => {
	const result = await prisma.blog.findMany({
		where: {
			AND: [{ companyid: { equals: Number(companyId) || undefined } }, { isdelete: { equals: 'N' || undefined } }],
		},
	});
	return bigIntToString(result);
};

export const getBlogById = async (blogId) => {
	const result = await prisma.blog.findOne({
		where: {
			AND: [{ id: { equals: Number(blogId) || undefined } }, { isdelete: { equals: 'N' || undefined } }],
		},
	});
	return bigIntToString(result);
};
