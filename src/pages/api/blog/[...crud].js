import handler from '../handler';
import { bigIntToString } from '../../../dbconfig/utils';
import { smartTrim } from '../../../components/utils/util';
const { stripHtml } = require('string-strip-html');
import prisma from '../../../dbconfig/prisma';
const slugify = require('slugify');


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
	}).post(async (req, res) => {
		console.log('blog create method call----> ', req.body);

		const { title, categories, tags, body, companyId } = req.body;

		let arrayOfCategories = categories;
		//&& categories.split(',');
		let arrayOfTags = tags;
		// && tags.split(',');

		let slug = slugify(title).toLowerCase();
		let mtitle = `${title} | ${process.env.APP_NAME}`;

		 let mdesc = stripHtml(body).result.substring(0, 160);

		let excerpt = smartTrim(body, 320, '', ' ...');

		let companyid = companyId;
		if (typeof companyId === 'string') {
			console.log('convertion method call');
			companyid = Number(companyId);
		}

		console.log("test company id------>",companyid)
		const result = await prisma.blog.create({
			data: {
				title: title,
				slug: slug,
				body: body,
				excerpt: excerpt,
				mtitle: mtitle,
				mdesc: mdesc,
				categories: arrayOfCategories,
				tags: arrayOfTags,
				companyid: companyid,
				isdelete:'N'
			},
		});
		res.status(201).send({ title: result.title, message: 'success' });
	})
;

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
	const result = await prisma.blog.findMany({
		where: {
			AND: [{ id: { equals: Number(blogId) || undefined } }, { isdelete: { equals: 'N' || undefined } }],
		},
	});
	return bigIntToString(result);
};
