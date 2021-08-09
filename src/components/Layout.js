import Navbar from './Navbar';
import Footer from '../components/Footer';

import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
import useUser from '../customHooks/useUser';
import { UserContext } from './../customHooks/UserContext';
import { useContext } from 'react';

const Layout = ({ children }) => {
	const classes = useStyles();
	const { mecheck, setMecheck } = useContext(UserContext);

	console.log('mecheck....' + JSON.stringify(mecheck));
	console.log('mecheck....' + mecheck.loggedIn);

	return (
		<>
			<Navbar links={mecheck.loggedIn} companyid={mecheck?.data?.user?.companyid || 0} />
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
