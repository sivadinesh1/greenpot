import Header from '../components/Header';


import { makeStyles } from '@material-ui/core/styles'

import React from 'react';

const Layout = ({ children }) => {
    const classes = useStyles()

    return (
        <>
            <Header />
            <main className={classes.content}>
                {children}
            </main>
        </>
    )
}

export default Layout;

const useStyles = makeStyles(theme => ({

    content: {
        flexGrow: 1,
        height: '100vh',


    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}))
