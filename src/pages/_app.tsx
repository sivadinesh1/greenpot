// import '../styles/globals.css';

// function MyApp({ Component, pageProps }) {
// 	return <Component {...pageProps} />;
// }

// export default MyApp;

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css'; // import Font Awesome CSS
import { config } from '@fortawesome/fontawesome-svg-core';

import { SWRConfig } from 'swr';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
// import { useEffect, useState } from 'react';

import messages from '../i18n';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Layout from '../components/Layout';

config.autoAddCss = false;

Router.events.on('routeChangeStart', () => NProgress.start());

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp(props) {
	const { Component, pageProps } = props;
	const { locale } = useRouter();

	console.log('in _app.....');

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			{/* <Loading isRouteChanging={state.isRouteChanging} key={state.loadingKey} /> */}
			<IntlProvider locale={locale} messages={messages[locale]}>
				<Head>
					<title>Red Apple Content Management System</title>
					<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
				</Head>
				<ThemeProvider theme={theme}>
					<SWRConfig
						value={{
							refreshInterval: 0,
							errorRetryCount: 0,
							shouldRetryOnError: false,
							revalidateOnMount: false,
							revalidateOnFocus: false,
							revalidateOnReconnect: false,
							compare: (a, b) => a === b,
							fetcher: (url: string) => axios(url).then((r) => r.data),
						}}>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</SWRConfig>
				</ThemeProvider>
			</IntlProvider>
		</React.Fragment>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
