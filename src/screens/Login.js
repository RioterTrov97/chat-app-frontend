import React, { useState } from 'react';
import '../styles/Login.css';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';
import { withRouter } from 'react-router-dom';
import { login, register } from '../actions/userActions';

function Login() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	const userLogin = useSelector((state) => state.userLogin);
	const { loading, error, userInfo } = userLogin;

	const signIn = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	const signUp = (e) => {
		e.preventDefault();
		console.log(error);
		console.log(userInfo);
		dispatch(register(name, email, password));
	};

	return (
		<div className="login">
			<div className="logo">
				<img
					src="https://icon-library.com/images/chat-icon-png/chat-icon-png-4.jpg"
					alt=""
				/>
				<p>OpenChat</p>
			</div>

			<div className="ComName">
				<span>Open to find your interests</span>
			</div>

			{loading ? (
				<LoadingScreen />
			) : (
				<div>
					<form>
						{isSignUp ? (
							<div className="logins">
								<input
									className="loginInput"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Full name"
									type="text"
								/>
							</div>
						) : null}

						<input
							className="loginInput"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							type="email"
						/>
						<input
							className="loginInput"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							type="password"
						/>

						<button
							type="submit"
							className="loginButton"
							onClick={isSignUp ? signUp : signIn}>
							{isSignUp ? 'Sign Up' : 'Sign In'}
						</button>
					</form>
					<p>
						Not a member?{' '}
						<span
							className="login__register"
							onClick={() => setIsSignUp(!isSignUp)}>
							{isSignUp ? 'Login' : 'Register Now'}
						</span>
					</p>
				</div>
			)}
		</div>
	);
}

export default withRouter(Login);
