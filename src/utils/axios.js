import axios from 'axios';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));

const instance = axios.create({
	baseURL:
		process.env.REACT_APP_URL ||
		'https://chat-app-socket-2021.herokuapp.com/api/',
});

export const instanceBearer = axios.create({
	baseURL:
		process.env.REACT_APP_URL ||
		'https://chat-app-socket-2021.herokuapp.com/api/',
	headers: {
		Authorization: 'Bearer ' + userInfo?.token,
	},
});

export const instanceAutoLogin = axios.create({
	baseURL:
		process.env.REACT_APP_URL ||
		'https://chat-app-socket-2021.herokuapp.com/api/',
	headers: {
		Authorization: 'Bearer ' + userInfo?.token,
	},
});

export default instance;
