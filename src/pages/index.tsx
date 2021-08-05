import Head from 'next/head';
import Image from 'next/image';

import Link from 'next/link';
import styles from '../styles/Home.module.scss';
import SigninComponent from '../components/auth/SigninComponent';
import useSWR from 'swr';

export default function Home() {
	const { data, mutate, error } = useSWR(`/api/auth/me`, {
		revalidateOnMount: true,
	});

	if (error) {
		console.log('dinesh ...ss ' + error.response.status);
		console.log('dinesh ...ss ' + error.response.data.message);
	}

	return (
		<>
			<div>
				<div className={styles.login_wrap}>
					<div className={styles.login_left}>
						<Image src='/static/images/creative.jpg' alt='hallmark academy logo' className={styles.left_img} width='720px' height='20px' />
					</div>
					<div className={styles.login_right}>
						<div className={styles.form_block}>
							<SigninComponent />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
