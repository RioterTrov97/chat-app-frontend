import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/App.css';
import { instanceAutoLogin } from './utils/axios';
import { login, selectUser } from './features/userSlice';
import Login from './screens/Login';
import LoadingScreen from './components/LoadingScreen';
import Chatroom from './screens/Chatroom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ChatPage from './screens/ChatPage';
import { io } from 'socket.io-client';
import Header from './components/Header';

function App() {
	const [loading, setLoading] = useState(true);
	const [socket, setSocket] = useState(null);
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	const setupSocket = () => {
		const token = window.localStorage.getItem('token');
		if (token && !socket) {
			const newSocket = io.connect(
				process.env.URL || 'https://chat-app-socket-2021.herokuapp.com',
				{
					query: {
						token: window.localStorage.getItem('token'),
					},
				}
			);

			newSocket.on('disconnect', () => {
				setSocket(null);
				setTimeout(setupSocket, 6000);
			});

			newSocket.on('connect', () => {
				console.log('Success: Socket Connected!');
			});

			setSocket(newSocket);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (window.localStorage.getItem('token')) {
			instanceAutoLogin
				.get('/user/me')
				.then((response) => {
					setLoading(false);
					dispatch(
						login({
							name: response.data.user.name,
							email: response.data.user.email,
							id: response.data.user.id,
							token: window.localStorage.getItem('token'),
						})
					);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		setupSocket();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="App">
			<div>
				<BrowserRouter>
					{loading ? (
						<LoadingScreen />
					) : !user ? (
						<Login />
					) : (
						<div>
							<Header />
							<Switch>
								<Route
									path="/"
									exact
									render={() => <Chatroom socket={socket} />}
								/>
								<Route
									path="/login"
									exact
									children={() => (
										<Login setupSoc={setupSocket} />
									)}
								/>
								<Route
									path="/chatpage/:id"
									exact
									render={(props) => (
										<ChatPage {...props} socket={socket} />
									)}
								/>
								<Redirect to="/" />
							</Switch>
						</div>
					)}
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
