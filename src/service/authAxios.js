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
		//	console.log('* you are not %% ' + JSON.stringify(error.response));
		console.log('* you are not &&&' + JSON.stringify(error.response.data));
		console.log('* you are not &&&' + JSON.stringify(error.response.status));

		if (error.response.status === 401) {
			//window.location.href = `${process.env.CLIENT_URL}`;
		}

		return Promise.reject(error);
	},
);

// window.location.href = `${process.env.REACT_APP_BASE_HREF}/login`;

// 		return response;
// 		// if (response.data.status === 'error') {
// 		// 	return response;
// 		// } else {
// 		// 	return response;
// 		// }
// 	},
// 	(error) => {
// 		const statusCode = error.status;
// 		console.log(statusCode);
// 		if (statusCode === 401) {
// 			console.log('in 401...............');
// 			Router.replace('/');

// 			//const redirectUrl = "https://"+window.location.hostname+"?p="+window.location.href+"#login"
// 			// const redirectUrl = "https://"+window.location.hostname
// 			// window.location.href = redirectUrl
// 		} else if (statusCode === 404) {
// 			// const history = useHistory();
// 			// history.push("/fc-404")
// 		} else if (statusCode === 400) {
// 			// console.log("400", hostname)
// 		}

// 		return error;
// 	},
// );

export { authAxios };

// response: {
//     status: 401,
//     statusText: 'Unauthorized',
//     headers: {
//       'content-type': 'application/json; charset=utf-8',
//       etag: '"2d-Qa/PCCt74ZXihdoIf2LPpnJ6xW0"',
//       'content-length': '45',

// res: IncomingMessage {
// 	_readableState: [ReadableState],
// 	_events: [Object: null prototype],
// 	_eventsCount: 3,
// 	_maxListeners: undefined,
// 	socket: [Socket],
// 	httpVersionMajor: 1,
// 	httpVersionMinor: 1,
// 	httpVersion: '1.1',
// 	complete: true,
// 	rawHeaders: [Array],
// 	rawTrailers: [],
// 	aborted: false,
// 	upgrade: false,
// 	url: '',
// 	method: null,
// 	statusCode: 401,
// 	statusMessage: 'Unauthorized',

// axios.interceptors.response.use(
// 	async (response) => { return response },
// 	async (error) => {
// 	  const originalRequest = error.config
// 	  const serverCallUrl = new URL(originalRequest.url)
// 	  const status = error.response.status

// 	  if (
// 		(status === 401 || status === 403) &&
// 		!originalRequest._retry &&
// 		!serverCallUrl.pathname.includes('/auth')
// 	  ) {
// 		let token = await refreshAccessToken()
// 		setAccessToken(token)

// 		originalRequest._retry = true
// 		originalRequest.headers.authorization = `Bearer ${token}`

// 		return axios(originalRequest)
// 	  }

// 	  return Promise.reject(error)
// 	})
