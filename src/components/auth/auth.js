// export const getAuthHeader = () => {
// 	return { headers: { Authorization: 'Bearer ' + getCookie('token') } };
// };

// export const signout = (next) => {
// 	removeLocalStorage('user');
// };

// // localstorage
// export const setLocalStorage = (key, value) => {
// 	if (process.browser) {
// 		localStorage.setItem(key, JSON.stringify(value));
// 	}
// };

// export const removeLocalStorage = (key) => {
// 	if (process.browser) {
// 		localStorage.removeItem(key);
// 	}
// };
// // autheticate user by pass data to cookie and localstorage
// export const authenticate = (data, next) => {
// 	setLocalStorage('user', data.user);
// 	next();
// };
import { state } from '../../utils/state';
import Router, { useRouter } from 'next/router';

export const forceLogout = () => {
	// localStorage.removeItem('islogged');
	// state.islogged = false;
	// state.user = null;
	Router.push('/');
};
