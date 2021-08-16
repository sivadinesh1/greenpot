import axios from 'axios';

// depending on base URL {ex: TwillioApi, FloApi, FloCommunityApi or any third party, create a axios instance}
// const floApi = axios.create({ baseURL: `${hostname}`, withCredentials: true });
// let axiosConfig = { method, url, headers, data }

const authAxios = axios.create({
	baseURL: process.env.API_URL,
});

authAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 401) {
			//window.location.href = `${process.env.CLIENT_URL}`;
		}

		return Promise.reject(error);
	},
);
