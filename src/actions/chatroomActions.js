import {
	CHATROOM_CREATE_FAIL,
	CHATROOM_CREATE_REQUEST,
	CHATROOM_CREATE_SUCCESS,
	CHATROOM_LIST_FAIL,
	CHATROOM_LIST_REQUEST,
	CHATROOM_LIST_SUCCESS,
} from '../constants/chatroomConstants';
import { instanceBearer } from '../utils/axios';
import { logout } from './userActions';

export const listChatrooms = () => async (dispatch) => {
	try {
		dispatch({ type: CHATROOM_LIST_REQUEST });

		const { data } = await instanceBearer.get(`/chatroom`);

		dispatch({
			type: CHATROOM_LIST_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CHATROOM_LIST_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createChatroom = (name, image, description) => async (
	dispatch
) => {
	try {
		dispatch({
			type: CHATROOM_CREATE_REQUEST,
		});

		const { data } = await instanceBearer.post(`/chatroom`, {
			name,
			image,
			description,
		});

		dispatch({
			type: CHATROOM_CREATE_SUCCESS,
			payload: data,
		});

		dispatch(listChatrooms());
	} catch (error) {
		const message =
			error.response && error.response.data.message
				? error.response.data.message
				: error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: CHATROOM_CREATE_FAIL,
			payload: message,
		});
	}
};
