import useSWR from 'swr';
import { useState } from 'react';

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

	const loggedIn = !error && data;
	// console.log('printing user data!!' + !error);
	// if (!error && data) {

	// }

	// setMecheck({ ...mecheck, loggedIn: false });

	let tempdata = data === 'UNAUTHORISED' ? null : data === undefined ? null : data;
	let temploggedIn = data === 'UNAUTHORISED' ? false : data === undefined ? false : true;

	const [mecheck, setMecheck] = useState({
		data: tempdata,
		loggedIn: temploggedIn,
	});

	console.log('printing user data' + JSON.stringify(data));

	return { mecheck, setMecheck };

	// return {
	// 	loading,
	// 	loggedIn,
	// 	user: data,
	// 	mutate,
	// };
}
