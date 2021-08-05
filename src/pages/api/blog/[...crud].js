import handler from '../handler';
import { bigIntToString } from '../../../dbconfig/utils';
import { smartTrim } from '../../../components/utils/util';
const { stripHtml } = require('string-strip-html');
import prisma from '../../../dbconfig/prisma';
const slugify = require('slugify');
import { getDB } from '../../../dbconfig/db';
const { db } = getDB();

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
	})
	.post(async (req, res) => {
		console.log("test blog request ----->",req.body)
		debugger
		const { title,description,author,articleDate, categories, tags, body, companyId } = req.body;

		const errors = [];

		const isdata = await checkDuplicateTitle(title, companyId);

		if (isdata > 0) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

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
			companyid = Number(companyId);
		}

		let newCatArr = arrayOfCategories.map((e) => {
			return parseInt(e.id);
		});

		let newTagArr = arrayOfTags.map((e) => {
			return parseInt(e.id);
		});
		// both works do not delete
		// let status= 'D';
		//   let	published= 'N';
		//   let isdelete='N';

		// db.one(
		// 	'INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags, companyid,isdelete, description, author,article_date,status,published) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[], $9,$10,$11,$12,$13,$14,$15) RETURNING id',
		// 	[title, slug, body, excerpt, mtitle, mdesc, newCatArr, newTagArr, companyid,isdelete, description, author, articleDate,status,published],
		// ).then((data) => {

		// 	// res.json({ title: title, message: 'success' });
		// 	res.status(201).send({ title: title, message: 'success' });
		// });

		const result = await prisma.blog.create({
			data: {
				title: title,
				slug: slug,
				body: body,
				excerpt: excerpt,
				mtitle: mtitle,
				mdesc: mdesc,
				categories: newCatArr,
				tags: newTagArr,
				companyid: companyid,
				isdelete: 'N'
				// description:description,
				// author:author,
				// article_date:articleDate,
				// status: 'D',
  				// published: 'N'
			},
		});

		res.status(201).send({ title: title, message: 'success' });
	});

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
	const result = await prisma.blog.findUnique({
		where: {
			id: Number(blogId),
		},
	});
	return bigIntToString(result);
};

const checkDuplicateTitle = async (title, companyid) => {
	const result = await prisma.blog.count({
		where: {
			title: title,
			companyid: Number(companyid),
		},
	});

	return result;
};