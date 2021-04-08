import React, { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Chatrooms.css';
import Chatroom from '../components/Chatroom';
import { useDispatch, useSelector } from 'react-redux';
import { listChatrooms } from '../actions/chatroomActions';

function Chatrooms() {
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { loading: loadingLogin, userInfo } = userLogin;

	const chatroomList = useSelector((state) => state.chatroomList);
	const { loading, chatrooms } = chatroomList;

	useEffect(() => {
		if (userInfo?.user) {
			dispatch(listChatrooms());
		}
	}, [dispatch, userInfo]);

	return (
		<div className="chatroomsContainer">
			{loading || loadingLogin ? (
				<LoadingScreen />
			) : (
				<div className="chatRoomsList">
					<div className="chatList">
						<p className="chatListHeader">Public Chatrooms</p>
						<div className="chatListRooms">
							{chatrooms?.map((chatroom) => (
								<Chatroom
									key={chatroom._id}
									id={chatroom._id}
									user={chatroom.user}
									name={chatroom.name}
									image={chatroom.image}
									description={chatroom.description}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Chatrooms;
