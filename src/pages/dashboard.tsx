import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Router from 'next/router';
import { parseCookies } from './api/auth/user';
import axios from 'axios';
import { useState } from 'react';
import RepoList from '../components/crud/Repo/repo-list';
import useSWR, { mutate, trigger } from 'swr';
import styles from '../styles/dashboard.module.scss';
import Image from 'next/image';

export const getServerSideProps = async (context) => {
	let { user_id, company_id, role_id } = await parseCookies(context?.req);
	if (user_id === undefined || company_id === undefined) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	// const blogs = await getBlogsByCompany(company_id);

	let resp = await axios.get(`${process.env.API_URL}/repository/${company_id}`);
	let repos = resp.data;

	return {
		props: { repos, company_id },
	};
};

const Dashboard = ({ repos, company_id }) => {
	const [message, setMessage] = useState(repos.length > 0 ? false : true);

	const { data } = useSWR(`/api/repository/${company_id}`, {
		initialData: repos,
	});

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles.repo_creator}>
					<div className={styles.left}>
						<div>New Article</div>
						<div>
							<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
						</div>
					</div>
					<div className={styles.right}>right</div>
				</div>

				{/* <RepoList repos={data} companyId={company_id} /> */}
			</div>
		</>
	);
};

export default Dashboard;
