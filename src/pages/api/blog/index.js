import nc from 'next-connect';
const { stripHtml } = require('string-strip-html');
const slugify = require('slugify');
import { smartTrim } from '../../../components/utils/util';
import { checkDuplicateTitle, createBlog, updateBlog } from '../../../service/blog.service';

import { bigIntToString } from '../../../dbconfig/utils';

const handler = nc()
	.post(async (req, res) => {
		const { title, description, author, articleDate, categories, tags, body, companyId } = req.body;

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
				isdelete: 'N',
				description: description,
				author: author,
				article_date: articleDate,
				status: 'D',
				published: 'N',
			},
		});

		res.status(201).send({ title: title, message: 'success' });
	})
	.put(async (req, res) => {
		const { id, title, description, author, articleDate, categories, tags, body, companyId, status } = req.body;

		const errors = [];

		const isdata = await checkDuplicateTitle(title, companyId);

		if (isdata > 1) {
			errors.push('Duplicate entry');
			if (errors.length > 0) {
				res.status(200).json({ errors });
				return;
			}
		}

		// let arrayOfCategories = categories;
		// //&& categories.split(',');
		// let arrayOfTags = tags;
		// // && tags.split(',');

		// let slug = slugify(title).toLowerCase();
		// let mtitle = `${title} | ${process.env.APP_NAME}`;

		// let mdesc = stripHtml(body).result.substring(0, 160);

		// let excerpt = smartTrim(body, 320, '', ' ...');

		// let companyid = companyId;
		// if (typeof companyId === 'string') {
		// 	companyid = Number(companyId);
		// }
		// console.log('cmp id ' + companyid);
		// let newCatArr = arrayOfCategories.map((e) => {
		// 	return parseInt(e.id);
		// });

		// let newTagArr = arrayOfTags.map((e) => {
		// 	return parseInt(e.id);
		// });

		// let currentDate = new Date();
		// // both works do not delete
		// // let status= 'D';
		// //   let	published= 'N';
		// //   let isdelete='N';

		// // db.one(
		// // 	'INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags, companyid,isdelete, description, author,article_date,status,published) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[], $9,$10,$11,$12,$13,$14,$15) RETURNING id',
		// // 	[title, slug, body, excerpt, mtitle, mdesc, newCatArr, newTagArr, companyid,isdelete, description, author, articleDate,status,published],
		// // ).then((data) => {

		// // 	// res.json({ title: title, message: 'success' });
		// // 	res.status(201).send({ title: title, message: 'success' });
		// // });

		// const result = await prisma.blog.update({
		// 	where: {
		// 		id: Number(id),
		// 	},
		// 	data: {
		// 		title: title,
		// 		slug: slug,
		// 		body: body,
		// 		excerpt: excerpt,
		// 		mtitle: mtitle,
		// 		mdesc: mdesc,
		// 		categories: newCatArr,
		// 		tags: newTagArr,
		// 		companyid: companyid,
		// 		isdelete: 'N',
		// 		description: description,
		// 		author: author,
		// 		article_date: articleDate,
		// 		status: status === 'N' ? 'D' : 'P',
		// 		published: status,
		// 		published_datetime: currentDate,
		// 	},
		// });

		const resutl = await updateBlog(id, title, description, author, articleDate, categories, tags, body, companyId, status);

		res.status(201).send({ title: title, message: 'success' });
	});

export default handler;
