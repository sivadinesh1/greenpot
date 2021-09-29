import nc from 'next-connect';
const { stripHtml } = require('string-strip-html');
const slugify = require('slugify');
import { smartTrim } from '../../../components/utils/util';
import { checkDuplicateTitle, createBlog, updateBlog } from '../../../service/blog.service';
import { deleteImage, getImages } from '../../../service/cloudinary.service';

import { bigIntToString } from '../../../db-config/utils';

const handler = nc()
	.post(async (req, res) => {
		if (req.body.operation === 'DELETE') {
			const data = await deleteImage(req.body.publicId);
			if (data.result === 'ok') {
				const result = await getImages(req.body.folder);
				res.status(200).json(result.length > 0 ? result : []);
			}
		}
	})
	.put(async (req, res) => {
		const { id, title, description, author, blogDate, categories, tag, content, company_id, status, createdAt, thumbnail, layout } = req.body;

		const errors = [];
		const isdata = await checkDuplicateTitle(title, company_id);

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

		// let company_id = company_id;
		// if (typeof company_id === 'string') {
		// 	company_id = Number(company_id);
		// }
		// console.log('cmp id ' + company_id);
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
		// //   let is_delete='N';

		// // db.one(
		// // 	'INSERT INTO blog(title, slug, body, excerpt, mtitle, mdesc, categories, tags, company_id,is_delete, description, author,blog_date,status,published) VALUES($1, $2, $3, $4, $5, $6, $7::integer[], $8::integer[], $9,$10,$11,$12,$13,$14,$15) RETURNING id',
		// // 	[title, slug, body, excerpt, mtitle, mdesc, newCatArr, newTagArr, company_id,is_delete, description, author, articleDate,status,published],
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
		// 		company_id: company_id,
		// 		is_delete: 'N',
		// 		description: description,
		// 		author: author,
		// 		blog_date: articleDate,
		// 		status: status === 'N' ? 'D' : 'P',
		// 		published: status,
		// 		published_datetime: currentDate,
		// 	},
		// });

		const result = await updateBlog(id, title, description, author, blogDate, categories, tag, company_id, status, createdAt, thumbnail, content, layout);

		res.status(201).send({ title: title, repo_id: result.repo_id, message: 'success' });
	});

export default handler;
