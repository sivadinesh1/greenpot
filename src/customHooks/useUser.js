import useSWR from 'swr';

import { getUser } from '../requests/userApi';

export default function useUser() {
	// const { data, mutate, error } = useSWR('api_user', getUser);

	const { data, mutate, error } = useSWR(`/api/auth/me`, {
		refreshInterval: 0,
		errorRetryCount: 0,
		shouldRetryOnError: false,
		revalidateOnMount: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		compare: (a, b) => a === b,
		fetcher: (url) => axios(url).then((r) => r.data),
	});

	const loading = !data && !error;
	const loggedIn = !error && data;

	console.log('printing user data' + JSON.stringify(data));

	return {
		loading,
		loggedIn,
		user: data,
		mutate,
	};
}
