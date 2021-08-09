import Head from 'next/head';
import Image from 'next/image';

import Link from 'next/link';
import styles from '../styles/Home.module.scss';
import SigninComponent from '../components/auth/SigninComponent';
import useSWR from 'swr';

import useUser from '../customHooks/useUser';

import { UserContext } from './../customHooks/UserContext';
import { useContext } from 'react';

const IndexPage = () => {
	const { mecheck, setMecheck } = useContext(UserContext);

	// const { data, mutate, error } = useSWR(`/api/auth/me`, {
	// 	revalidateOnMount: true,
	// });

	// if (error) {
	// 	console.log('dinesh ...ss ' + error.response.status);
	// 	console.log('dinesh ...ss ' + error.response.data.message);
	// 	return <SigninComponent />;
	// }

	// if (!data) return 'Loading';

	const DisplayInfo = () => {
		// if (loading) return <div className='container'> Loading... </div>;
		// if (loggedIn && user.id)
		// 	return (
		// 		<div className='container'>
		// 			{' '}
		// 			Id: {user.first_name} <br />
		// 		</div>
		// 	);

		return <div className='container'> Login to get info </div>;
	};

	return (
		<>
			{!mecheck.loggedIn ? (
				<div>
					<div className={styles.login_wrap}>
						<div className={styles.login_left}>
							<Image src='/static/images/creative.jpg' alt='hallmark academy logo' className={styles.left_img} width='720px' height='20px' />
						</div>
						<div className={styles.login_right}>
							<div className={styles.form_block}>
								<DisplayInfo />
								<SigninComponent />
							</div>
						</div>
					</div>
				</div>
			) : (
				<>
					<div>Welcome back !!!</div>
				</>
			)}
		</>
	);
};

export default IndexPage;
