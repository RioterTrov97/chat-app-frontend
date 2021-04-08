import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/App.css';
import Login from './screens/Login';
import LoadingScreen from './components/LoadingScreen';
import Chatrooms from './screens/Chatrooms';
import CreateChatroom from './screens/CreateChatroom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ChatPage from './screens/ChatPage';
import { io } from 'socket.io-client';
import Header from './components/Header';
import { verifyUser } from './actions/userActions';

function App() {
	const [socket, setSocket] = useState(null);
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { loading, userInfo } = userLogin;

	const setupSocket = () => {
		const token = userInfo?.token;
		if (token && !socket) {
			const newSocket = io.connect(
				process.env.REACT_APP_URL ||
					'https://chat-app-socket-2021.herokuapp.com',
				{
					query: {
						token: userInfo?.token,
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
		if (localStorage.getItem('userInfo')) {
			dispatch(verifyUser());
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
					) : !userInfo ? (
						<Login />
					) : (
						<div>
							<Header />
							<Switch>
								<Route
									path="/"
									exact
									render={() => <Chatrooms socket={socket} />}
								/>
								<Route
									path="/create"
									exact
									render={() => <CreateChatroom />}
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
										<ChatPage
											{...props}
											socket={socket}
											setupSoc={setupSocket}
										/>
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
