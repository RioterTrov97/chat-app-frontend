import {
	CHATROOM_CREATE_FAIL,
	CHATROOM_CREATE_REQUEST,
	CHATROOM_CREATE_RESET,
	CHATROOM_CREATE_SUCCESS,
	CHATROOM_LIST_FAIL,
	CHATROOM_LIST_REQUEST,
	CHATROOM_LIST_SUCCESS,
} from '../constants/chatroomConstants';

export const chatroomListReducer = (state = { chatrooms: [] }, action) => {
	switch (action.type) {
		case CHATROOM_LIST_REQUEST:
			return { loading: true, chatrooms: [] };
		case CHATROOM_LIST_SUCCESS:
			return {
				loading: false,
				chatrooms: action.payload,
			};
		case CHATROOM_LIST_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const chatroomCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case CHATROOM_CREATE_REQUEST:
			return { loading: true };
		case CHATROOM_CREATE_SUCCESS:
			return { loading: false, success: true, chatroom: action.payload };
		case CHATROOM_CREATE_FAIL:
			return { loading: false, error: action.payload };
		case CHATROOM_CREATE_RESET:
			return {};
		default:
			return state;
	}
};
