import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { logout } from '../actions/userActions';
import '../styles/Header.css';

function Header() {
	const dispatch = useDispatch();
	const history = useHistory();

	const loggingOut = (e) => {
		e.preventDefault();
		dispatch(logout());
	};
	return (
		<div className="header">
			<div className="headerLeft" onClick={() => history.push('/')}>
				<img
					src="https://icon-library.com/images/chat-icon-png/chat-icon-png-4.jpg"
					alt=""
				/>
				<p>OpenChat</p>
			</div>

			<div
				className="headerNavItems"
				onClick={() => history.push('/create')}>
				<i className="fas fa-plus-circle"></i>
				<p>Create Chatroom</p>
			</div>

			<div
				className="headerNavItems"
				onClick={(e) => {
					loggingOut(e);
				}}>
				<i className="fas fa-sign-out-alt"></i>
				<p>Log Out</p>
			</div>
		</div>
	);
}

export default withRouter(Header);
