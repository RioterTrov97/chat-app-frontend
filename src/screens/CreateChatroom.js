import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { createChatroom } from '../actions/chatroomActions';
import '../styles/createChatroom.css';

const CreateChatroom = () => {
	const [chatroomName, setChatroomName] = useState('');
	const [chatroomImage, setChatroomImage] = useState('');
	const [chatroomDescription, setChatroomDescription] = useState('');

	const history = useHistory();

	const dispatch = useDispatch();
	const chatroomCreate = useSelector((state) => state.chatroomCreate);
	const { success } = chatroomCreate;

	const resetForm = () => {
		setChatroomName('');
		setChatroomDescription('');
		setChatroomImage('');
	};

	useEffect(() => {
		if (success) {
			resetForm();
		}
	}, [success]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			createChatroom(chatroomName, chatroomImage, chatroomDescription)
		);
	};

	return (
		<div className="createChatContainer">
			<button
				className="createChatGoBack"
				onClick={() => history.push('/')}>
				Go Back
			</button>
			<div className="createChat">
				<h3>Create New Chatroom</h3>
				<div>
					<input
						value={chatroomName}
						onChange={(e) => setChatroomName(e.target.value)}
						placeholder="Enter Chatroom Name"
						type="text"
					/>
					<input
						value={chatroomImage}
						onChange={(e) => setChatroomImage(e.target.value)}
						placeholder="Enter Chatroom Pic URL"
						type="text"
					/>
					<textarea
						value={chatroomDescription}
						onChange={(e) => setChatroomDescription(e.target.value)}
						placeholder="Enter Chatroom Description"
						type="text"
					/>
					<button
						className="createChat__button"
						onClick={(e) => submitHandler(e)}>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateChatroom;
