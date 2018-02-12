import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import Header from './Header';

class LoginPage extends Component {
	state = {
		username: '',
		password: '',
	};

	componentWillMount() {
		axios
			.get('http://localhost:3030/checklogin')
			.then(response => {
				if (response.data.loggedin) {
					window.location.href = 'http://localhost:3000/notes';
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	}

	changeStateForUserName = valueToUpdate => {
		this.setState({ username: valueToUpdate.target.value });
	};

	changeStateForPwd = valueToUpdate => {
		this.setState({ password: valueToUpdate.target.value });
	};

	makeAxiosCall = () => {
		if (this.state.username.trim() === '' || this.state.password.trim() === '') {
			alert('Please enter both fields');
		} else {
			axios
				.post('http://localhost:3030/login', {
					u: `${this.state.username}`,
					p: `${this.state.password}`,
				})
				.then(response => {
					if (response.data.loginStatus === 'successful') {
						cookie.save('loggedinuser', this.state.username, {
							httpOnly: false,
						});
						window.location.href = 'http://localhost:3000/notes';
					} else {
						alert('Invalid Credentials');
					}
				})
				.catch(error => {
					console.error('axios error', error);
				});
		}
	};

	render() {
		return (
			<div className="loginPageBody">
				<Header />
				<form className="formContainer">
					<div className="loginBox">
						<label htmlFor="username">Username</label>
						<input id="username" type="text" onChange={this.changeStateForUserName} />
						<label htmlFor="password">Password</label>
						<input id="password" type="password" onChange={this.changeStateForPwd} />
						<button
							type="button"
							className="btn btn-primary"
							onClick={this.makeAxiosCall}
						>
							Login
						</button>
					</div>
				</form>
			</div>
		);
	}
}

export default LoginPage;
