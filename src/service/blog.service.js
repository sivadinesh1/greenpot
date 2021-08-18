import prisma from '../dbconfig/prisma';
import { bigIntToString } from '../dbconfig/utils';
import { getDB } from '../dbconfig/db';
const { db } = getDB();
const slugify = require('slugify');
const { nanoid } = require('nanoid');
import { smartTrim } from '../components/utils/util';
const { stripHtml } = require('string-strip-html');

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

export const getBlog = async (blogId) => {
	let query = `SELECT b.id, b.title, b.slug, b.body, 
		b.description,b.author,CAST(b.article_date AS char) as article_date,b.status,
		array_agg(distinct(c )) as categories, 	
		array_agg(distinct(t.name )) as tags
	
		FROM blog b
			 LEFT outer JOIN categories as c ON c.id = SOME(b.categories)
			 LEFT  JOIN tags as t ON t.id = SOME(b.tags)
		WHERE
			b.id = ${blogId}	
		 GROUP BY title, b.id ORDER BY id`;

	return new Promise(function (resolve) {
		db.oneOrNone(query, []).then((data) => {
			resolve(data);
		});
	});
};

export const checkDuplicateTitle = async (title, companyid) => {
	const result = await prisma.blog.count({
		where: {
			title: title,
			companyid: Number(companyid),
		},
	});

	return result;
};

export const createBlogEntry = async (company_id) => {
	const result = await prisma.blog.create({
		data: {
			title: `Untitled - ${nanoid(11)}`,
			slug: '',
			body: '',
			excerpt: '',
			mtitle: '',
			mdesc: '',
			author: '',
			description: '',
			companyid: Number(company_id),
			isdelete: 'N',
			article_date: new Date(),
			status: 'D',
			published: 'N',
		},
	});

	return bigIntToString(result);
};

export const updateBlog = async (id, title, description, author, articleDate, categories, tags, body, companyId, status) => {
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

	let currentDate = new Date();
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

	const result = await prisma.blog.update({
		where: {
			id: Number(id),
		},
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
			isdelete: 'N',
			description: description,
			author: author,
			article_date: articleDate,
			status: status === 'N' ? 'D' : 'P',
			published: status,
			published_datetime: currentDate,
		},
	});
};
