import Navbar from './Navbar';
import Footer from '../components/Footer';

import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
import useUser from '../customHooks/useUser';
import { UserContext } from './../customHooks/UserContext';
import { useContext } from 'react';

const Layout = ({ children }) => {
	const classes = useStyles();
	const { user, loading, loggedIn } = useUser();
	const msg = useContext(UserContext);

	console.log('dines@# ' + msg);

	return (
		<>
			<Navbar links={loggedIn} companyid={user?.companyid} role={user?.user_role[0]?.role_id === '1' ? 'Admin' : ''} />
			<main className={classes.content}>{(children, 'test')}</main>
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
