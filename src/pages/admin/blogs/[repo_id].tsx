import Layout from '../../../components/Layout';

import React, { useState } from 'react';

import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';

import styles from '../../../styles/Category.module.scss';

import BlogList from '../../../components/crud/Blog/blog-list';
// import { getBlogsByCompany } from '../../api/blog/[...slug]';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import { Button } from '@material-ui/core';
import Link from 'next/link';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Router from 'next/router';
import { parseCookies } from '../../api/auth/user';

export const getServerSideProps = async (context) => {
	let { user_id, company_id,role_id } = await parseCookies(context?.req);
	console.log("role id--->",role_id)
	if (user_id === undefined || company_id === undefined ) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}
	console.log("test request repo id--->",context.query.repo_id)
	const repo_id=context.query.repo_id
	// const blogs = await getBlogsByCompany(company_id);

	let resp = await axios.get(`${process.env.API_URL}/blog/repo/${repo_id}`);
	let blogs = resp.data;

	return {
		props: { blogs, company_id,repo_id },
	};
};

export default function Index({ blogs, company_id,repo_id }) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('list');

	// const { data: result } = useSWR(`/api/blog/company/${company_id}`, { initialData: blogs });
	const { data: result } = useSWR(`/api/blog/repo/${repo_id}`, { initialData: blogs });
	
	let blogsList: Blog[] = result;

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	const reloadBlogList = async () => {
		mutate(`/api/blog/repo/${repo_id}`);
		await axios.get(`/api/blog/repo/${repo_id}`);
		trigger(`/api/blog/repo/${repo_id}`);
	};

	const chooseMode = (mode: string) => {
		setMode(mode);
	};

	const handleAddBlog = async (event) => {
		event.stopPropagation();
		debugger
		const blog = await axios.get(`/api/blog/new/${company_id}/${repo_id}`);

		Router.push(`/admin/blog-edit/${company_id}/${blog.data.id}`);
	};

	return (
		<>
			<div className={styles.cat_wrap}>
				<div className={styles.left}>
					<div className={styles.blogAdd} onClick={handleAddBlog}>
						+ Add Blog
					</div>
				</div>

				<div className={styles.right}>
					{mode === 'list' && (
						<BlogList
							blogs={blogsList}
							onReloadBlogList={reloadBlogList}
							handleSnackOpen={handleSnackOpen}
							onMode={chooseMode}
							company_id={company_id}
							repo_id={repo_id}
						/>
					)}
				</div>
			</div>

			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
					{message}
				</MuiAlert>
			</Snackbar>
		</>
	);
}
