import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import '../styles/Chatroom.css';
import { instanceAutoLogin } from '../utils/axios';

const Chatroom = ({ id, user, name, image, description }) => {
	const history = useHistory();
	const [creator, setCreator] = useState('');

	useEffect(() => {
		instanceAutoLogin
			.post('/user', { id: user })
			.then((response) => {
				setCreator(response.data.username);
			})
			.catch((err) => {
				console.log(err);
			});

		// eslint-disable-next-line
	}, []);

	const capitalizeFirstChar = (str) =>
		str.charAt(0).toUpperCase() + str.substring(1);

	return (
		<div className="chatRoom">
			<img className="chatRoomImg" src={image} alt={name} />
			<p className="chatRoomName">{name}</p>
			<p className="chatRoomDesc">{description}</p>
			<p className="chatRoomCreated">
				- {capitalizeFirstChar(creator.split(' ')[0])}
			</p>
			<div
				onClick={() => history.push(`/chatpage/${id}`)}
				className="joinChatRoom">
				Join
			</div>
		</div>
	);
};

export default Chatroom;
