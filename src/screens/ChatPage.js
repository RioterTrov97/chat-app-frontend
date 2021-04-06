import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { instanceAutoLogin } from '../utils/axios';
import '../styles/ChatPage.css';
import { selectUser } from '../features/userSlice';

function ChatPage({ match, socket }) {
	const chatroomId = match.params.id;
	const [chatroomName, setChatroomName] = useState('');
	const [messageData, setMessageData] = useState('');
	const [oldMessages, setOldMessages] = useState([]);
	const [toggle, setToggle] = useState(false);
	const user = useSelector(selectUser);
	const history = useHistory();

	const keyCheck = true;

	let data = {
		chatroomId,
	};

	const getChatroomName = () => {
		instanceAutoLogin
			.post('/chatroom/name', data)
			.then((response) => {
				setChatroomName(response.data.name);
			})
			.catch((err) => {
				console.log(err);
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
		console.log('USE EFFECT: New toggle :', toggle);
		getAllMessages();
		// eslint-disable-next-line
	}, [toggle]);

	const sendMessage = (e, check) => {
		e.preventDefault();
		if (socket && !check) {
			socket.emit('ChatroomMessage', chatroomId, messageData);
		}

		if (e.key === 'Enter') {
			if (socket) {
				socket.emit('ChatroomMessage', chatroomId, messageData);
			}
		}
	};

	const AlwaysScrollToBottom = () => {
		const elementRef = useRef();
		useEffect(() => elementRef.current.scrollIntoView());
		return <div ref={elementRef} />;
	};

	useEffect(() => {
		socket.emit('joinRoom', chatroomId);

		socket.on('newMessage', () => {
			setToggle((prevToggle) => !prevToggle);
			setMessageData('');
		});

		return () => {
			socket.emit('leaveRoom', chatroomId);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className="chatBox">
			<div className="chatHead">
				<div className="backButton" onClick={() => history.push('/')}>
					Back
				</div>
				<p>Welcome to {chatroomName}</p>
			</div>
			<div className="chatBody">
				{oldMessages.map((msg, i) => (
					<div key={i} className="messages">
						<div
							className={
								user.id === msg.user ? 'myName' : 'otherName'
							}>
							{msg.name}
						</div>
						<span
							className={
								user.id === msg.user
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
					onKeyUp={(e) => sendMessage(e, keyCheck)}
					onChange={(e) => setMessageData(e.target.value)}
					placeholder="New Message"
					type="text"
				/>
				<button onClick={(e) => sendMessage(e)}>Send Message</button>
			</div>
		</div>
	);
}

export default ChatPage;