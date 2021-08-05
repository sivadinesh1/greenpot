import Navbar from './Navbar';
import Footer from '../components/Footer';

import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
import useUser from '../customHooks/useUser';

const Layout = ({ children }) => {
	const classes = useStyles();
	const { user, loading, loggedIn } = useUser();

	return (
		<>
			<Navbar links={loggedIn} />
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
