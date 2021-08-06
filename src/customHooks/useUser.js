import useSWR from 'swr';

import { getUser } from '../requests/userApi';

export default function useUser() {
	// const { data, mutate, error } = useSWR('api_user', getUser);

	const { data, mutate, error } = useSWR(`/api/auth/me`, {
		revalidateOnMount: true,
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
