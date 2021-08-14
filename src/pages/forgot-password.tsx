import Image from 'next/image';

import styles from '../styles/Home.module.scss';
import FPComponent from '../components/auth/forgot-password';

const ForgotPassword = () => {
	return (
		<>
			<div>
				<div className={styles.login_wrap}>
					<div className={styles.login_left}>
						<Image src='/static/images/creative.jpg' alt='hallmark academy logo' className={styles.left_img} width='720px' height='20px' />
					</div>
					<div className={styles.login_right}>
						<div className={styles.form_block}>
							<FPComponent /> 
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
