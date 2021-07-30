import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import React, { useState } from 'react';
import { getCompany } from '../../../components/auth/auth';
import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/Category.module.scss';
import BlogList from '../../../components/crud/Blog/blog-list';
import { getAllBlogs, getBlogsByCompany } from '../../api/blog/[...crud]';
import BlogAdd from '../../../components/crud/Blog/blog-add';


import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	const blogs = await getBlogsByCompany(company_id);
	return {
		props: { blogs },
	};
};

export interface BlogProps {
	blogs: Blog[];
}

export default function Index({ blogs }: BlogProps) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('list');
	var companyId = getCompany();
	const { data: result } = useSWR(`/api/blog/crud/company/${companyId}`, { initialData: blogs, revalidateOnMount: true });

	let blogsList: Blog[] = result;

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	const reloadBlogList = async () => {
		mutate(`/api/blog/crud/company/${companyId}`);
		await axios.get(`/api/blog/crud/company/${companyId}`);
		trigger(`/api/blog/crud/company/${companyId}`);
	};

	const chooseMode = (mode: string) => {
		setMode(mode);
	};


	return (
		<Layout>
			<Admin>
				<div className={styles.cat_wrap}>
					<div className={styles.left}></div>

					<div className={styles.right}>
					{ mode ==='list'&&
						<BlogList blogs={blogsList} onReloadBlogList={reloadBlogList} handleSnackOpen={handleSnackOpen} onMode={chooseMode} />
					}
					{ mode ==='add'&&
						<BlogAdd onMode={chooseMode} blogs={blogsList} handleSnackOpen={handleSnackOpen} onReloadBlogList={reloadBlogList}/>
						}
					</div>
				</div>
			</Admin>
			<SnackBar open={snack} handleClose={() => setSnack(false)} message={message}></SnackBar>
		</Layout>
	);
}
