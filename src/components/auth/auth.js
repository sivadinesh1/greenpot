import cookie from 'js-cookie';

export const getAuthHeader = () => {
	return { headers: { Authorization: 'Bearer ' + getCookie('token') } };
};

export const signout = (next) => {
	removeCookie('token');
	removeCookie('user');
	removeLocalStorage('user');
	next();

	return Api.get(`/signout`);
};

// set cookie
export const setCookie = (key, value) => {
	if (process.browser) {
		cookie.set(key, value, {
			expires: 1,
		});
	}
};

export const removeCookie = (key) => {
	if (process.browser) {
		cookie.remove(key, {
			expires: 1,
		});
	}
};
// get cookie
export const getCookie = (key) => {
	if (process.browser) {
		return cookie.get(key);
	}
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
	setCookie('token', data.token);
	setCookie('user', data.user);
	setLocalStorage('user', data.user);
	next();
};

export const isAuth = () => {
	if (process.browser) {
		const cookieChecked = getCookie('token');
		if (cookieChecked) {
			if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'));
			} else {
				return false;
			}
		}
	}
};

export const getCompany = () => {
	if (process.browser) {
		const cookieChecked = getCookie('token');
		if (cookieChecked) {
			if (localStorage.getItem('user')) {
				let data = JSON.parse(localStorage.getItem('user'));

				return data.companyid;
			} else {
				return false;
			}
		}
	}
};

export const getCompanyFromCookie = () => {
	if (process.browser) {
		const cookieChecked = getCookie('user');
		if (cookieChecked) {
			return cookieChecked.companyid;
		}
	}
};

const cookieChecked = getCookie('token');
