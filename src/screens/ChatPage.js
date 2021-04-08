import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { instanceAutoLogin } from '../utils/axios';
import '../styles/ChatPage.css';
import LoadingScreen from '../components/LoadingScreen';

function ChatPage({ socket, setupSoc }) {
	const { id: chatroomId } = useParams();
	const [chatroomDetails, setChatroomDetails] = useState(null);
	const [messageData, setMessageData] = useState('');
	const [oldMessages, setOldMessages] = useState([]);
	const [toggle, setToggle] = useState(false);
	const [settingSoc, setSettingSoc] = useState(false);
	const [loading, setLoading] = useState(false);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo: user } = userLogin;
	const history = useHistory();

	const keyCheck = true;

	let data = {
		chatroomId,
	};

	const getChatroomName = () => {
		setLoading(true);
		instanceAutoLogin
			.post('/chatroom/name', data)
			.then((response) => {
				console.log(response.data);
				setChatroomDetails(response.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	const getAllMessages = () => {
		instanceAutoLogin
			.post('/message/messages', { chatroomId })
			.then((response) => {
				setOldMessages(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getChatroomName();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getAllMessages();
		// eslint-disable-next-line
	}, [toggle]);

	const sendMessage = (e, check) => {
		e.preventDefault();
		if (socket && !check) {
			socket.emit('ChatroomMessage', chatroomId, messageData);
			setMessageData('');
		}

		if (e.key === 'Enter') {
			if (socket) {
				socket.emit('ChatroomMessage', chatroomId, messageData);
				setMessageData('');
			}
		}
	};

	const AlwaysScrollToBottom = () => {
		const elementRef = useRef();
		useEffect(() => elementRef.current.scrollIntoView());
		return <div ref={elementRef} />;
	};

	const capitalizeFirstChar = (str) =>
		str.charAt(0).toUpperCase() + str.substring(1);

	useEffect(() => {
		if (socket) {
			console.log('socket is here');
			socket.emit('joinRoom', chatroomId);

			socket.on('newMessage', () => {
				setToggle((prevToggle) => !prevToggle);
				setMessageData('');
			});

			return () => {
				socket.emit('leaveRoom', chatroomId);
			};
		} else {
			console.log('setting up socket again');
			setSettingSoc(!settingSoc);
			setupSoc();
		}

		// eslint-disable-next-line
	}, [settingSoc]);

	return (
		<div className="chatBox__container">
			<div className="chatBoxMain">
				{loading ? (
					<LoadingScreen />
				) : (
					<>
						<div className="chatBoxMiddle">
							<div className="chatBox">
								<div className="chatHead">
									<div
										className="backButton"
										onClick={() => history.push('/')}>
										Back
									</div>
									<p>
										Welcome to{' '}
										{chatroomDetails?.chatroom?.name}
									</p>
								</div>
								<div className="chatBody">
									{oldMessages.map((msg, i) => (
										<div key={i} className="messages">
											<div
												className={
													user.user.id === msg.user
														? 'myName'
														: 'otherName'
												}>
												{msg.name}
											</div>
											<span
												className={
													user.user.id === msg.user
														? 'myMessage'
														: 'OtherMessage'
												}>
												{msg.message}
											</span>
										</div>
									))}
									<AlwaysScrollToBottom />
								</div>
								<div className="chatInput">
									<input
										value={messageData}
										onKeyUp={(e) =>
											sendMessage(e, keyCheck)
										}
										onChange={(e) =>
											setMessageData(e.target.value)
										}
										placeholder="New Message"
										type="text"
									/>
									<button onClick={(e) => sendMessage(e)}>
										<i className="fas fa-paper-plane"></i>
										Send
									</button>
								</div>
							</div>
						</div>
						<div className="chatBoxRight">
							<div className="chatBoxImgContainer">
								<img
									className="chatBoxImg"
									src={chatroomDetails?.chatroom?.image}
									alt={chatroomDetails?.chatroom?.name}
								/>
							</div>

							<p className="chatBoxDesc">
								{chatroomDetails?.chatroom?.description}
							</p>
							<p className="chatBoxAdmin">
								Room Owner:{' '}
								<span>
									{chatroomDetails?.username &&
										capitalizeFirstChar(
											chatroomDetails.username.split(
												' '
											)[0]
										)}
								</span>
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default ChatPage;
