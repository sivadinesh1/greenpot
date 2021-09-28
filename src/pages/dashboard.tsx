import axios from 'axios';
import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { forceLogout } from '../components/auth/auth';
import BlogWorkspace from '../components/dashboard/blog-workspace';
import NoWorkspace from '../components/dashboard/no-workspace';
import LeadPageWorkspace from '../components/dashboard/lead-page-workspace';
import RepoSidebar from '../components/RepoSidebar';
import TemplateList from '../components/template/ListTemplates';
import { IRepo } from '../model/Repo';
import styles from '../styles/dashboard.module.scss';

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let repos = null;
	let blogs = [];
	let company_id = null;
	let repo_id = null;
	let lead_pages = [];

	try {
		cookie = context?.req?.headers.cookie;

		//1. fetch repo summary
		let result = await axios.get(`${process.env.API_URL}/repository/fetch-repos-summary`, {
			headers: {
				cookie: cookie!,
			},
		});

		repos = result.data;

		if (repos.length === 0) {
		} else {
			repo_id = repos[0].id;

			// fetch blogs
			let result1 = await axios.get(`${process.env.API_URL}/blog/repo/${repo_id}`, {
				headers: {
					cookie: cookie!,
				},
			});
			blogs = result1.data;

			//fetch lead pages
			let result2 = await axios.get(`${process.env.API_URL}/lead-page/repo/${repo_id}`, {
				headers: {
					cookie: cookie!,
				},
			});
			lead_pages = result2.data;
		}
	} catch (error) {
		console.log(`error in dashboard@! ${error.message}`);
		isError = true;
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	return {
		props: { repos, company_id, blogs, repo_id, isError, lead_pages },
	};
};

const Dashboard = ({ repos, company_id, blogs_data, repo_id, isError, lead_pages_data }) => {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	const [selectedRepo, setSelectedRepo] = useState(repos ? repos[0] : null);

	const { data: repoArr, mutate: mutateRepos } = useSWR(`/api/repository/fetch-repos-summary`, {
		initialData: repos,
	});

	const { data: blogs, mutate: mutateBlogs } = useSWR(`/api/blog/repo/${selectedRepo?.id}`, {
		initialData: blogs_data,
	});
	console.log("test blog data---->", blogs)
	const {
		data: lead_pages,
		mutate: mutateLeadPages,
		error: errorCTemp,
	} = useSWR(`/api/lead-page/repo/${selectedRepo?.id}`, {
		initialData: lead_pages_data,
	});

	const reloadBlogs = async (repo) => {
		//	setSelectedRepo(repo);
		mutateBlogs();
		mutateRepos();
	};

	const reloadRepos = async (repo: IRepo) => {
		setSelectedRepo(repo);
		mutateRepos();
	};

	return (
		<>
			<RepoSidebar repos={repoArr} reloadRepos={reloadRepos} />

			<div className={styles.wrapper}>
				{repoArr && repoArr.length === 0 && <NoWorkspace />}
				{repoArr && repoArr.length > 0 && selectedRepo.repo_type === 'T' ? (
					<LeadPageWorkspace selectedRepo={selectedRepo} lead_pages={lead_pages} />
				) : (
						<BlogWorkspace selectedRepo={selectedRepo} blogs={blogs} reload={reloadBlogs} />
					)}
			</div>
		</>
	);
};

export default Dashboard;
const plus = {
	backgroundColor: 'red',
	display: 'flex',
	justifyContent: 'center',
	borderRadius: '5px',
	padding: '10px',
};
