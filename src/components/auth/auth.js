export const getAuthHeader = () => {
	return { headers: { Authorization: 'Bearer ' + getCookie('token') } };
};

export const signout = (next) => {
	removeLocalStorage('user');
};

// localstorage
export const setLocalStorage = (key, value) => {
	if (process.browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

export const removeLocalStorage = (key) => {
	if (process.browser) {
		localStorage.removeItem(key);
	}
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
	setLocalStorage('user', data.user);
	next();
};

// export const isAuth = () => {
// 	if (process.browser) {
// 		if (localStorage.getItem('user')) {
// 			return JSON.parse(localStorage.getItem('user'));
// 		} else {
// 			return false;
// 		}
// 	}
// };

// export const getCompany = () => {
// 	if (process.browser) {
// 		if (localStorage.getItem('user')) {
// 			let data = JSON.parse(localStorage.getItem('user'));

// 			return data.companyid;
// 		} else {
// 			return false;
// 		}
// 	}
// };
