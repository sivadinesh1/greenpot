import Navbar from './Navbar';
import Footer from '../components/Footer';

import { makeStyles } from '@material-ui/core/styles';

import React from 'react';

const Layout = ({ children }) => {
	const classes = useStyles();

	return (
		<>
			<Navbar links={true} companyid={2} />
			<main className={classes.content}>{children}</main>
			<Footer />
		</>
	);
};

export default Layout;

const useStyles = makeStyles((theme) => ({
	content: {
		flexGrow: 1,
		height: '100vh',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
}));

// printing user data{"id":"7","first_name":"dinesh","companyid":"1","user_role":[{"role_id":"1"}]}
// role={user?.user_role[0]?.role_id === '1' ? 'Admin' : ''}
