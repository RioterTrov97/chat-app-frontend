import axios from 'axios';

const instance = axios.create({
	//https://chat-app-socket-2021.herokuapp.com
	//http://localhost:8000
	baseURL: process.env.URL || 'https://chat-app-socket-2021.herokuapp.com',
});

export const instanceAutoLogin = axios.create({
	baseURL: process.env.URL || 'https://chat-app-socket-2021.herokuapp.com',
	headers: {
		Authorization: 'Bearer ' + window.localStorage.getItem('token'),
	},
});

export default instance;
