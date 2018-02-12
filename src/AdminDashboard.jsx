import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import Header from './Header';

class AdminDashboard extends Component {
	state = {
		selectedOption: '',
		users: [],
		roleInfo: '',
		userData: [],
		userType: '',
	};

	handleChange = selectedOption => {
		if (selectedOption) {
			this.setState({
				selectedOption,
				roleInfo: this.state.userData[selectedOption.index].role,
			});
		} else {
			this.setState({ selectedOption, roleInfo: '' });
		}
	};

	fetchUserData = () => {
		axios
			.get('http://localhost:3030/getusers/')
			.then(response => {
				this.setState(
					{
						users: response.data.users,
						userData: response.data.users,
					},
					() => {
						let newOptions = [];
						for (var user in response.data.users) {
							newOptions.push({
								value: response.data.users[user].userid,
								label: response.data.users[user].userid,
								index: user,
							});
						}
						this.setState({ users: newOptions });
					},
				);
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	logout = () => {
		axios
			.post('http://localhost:3030/logout')
			.then(response => {
				if (response.data.logout === 'successful') {
					alert('Successfully logged out!');
					window.location.href = 'http://localhost:3000';
				} else {
					alert("Couldn't save, please try again!");
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	getUserType = () => {
		axios
			.get('http://localhost:3030/getusertype/')
			.then(response => {
				this.setState({
					userType: response.data.userType,
				});
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	componentWillMount() {
		this.getUserType();
		this.fetchUserData();
	}

	updateRole = roleType => {
		axios
			.post('http://localhost:3030/updaterole', {
				uid: this.state.selectedOption.value,
				roleType: roleType,
			})
			.then(response => {
				if (response.data.roleUpdated) {
					alert('Role Updated!');
					this.setState({ roleInfo: roleType });
					this.fetchUserData();
				} else {
					alert("Couldn't update, please try again!");
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	render() {
		const { selectedOption } = this.state;
		const value = selectedOption && selectedOption.value;

		if (this.state.users.length !== 0 && this.state.userType === 'superadmin') {
			return (
				<div>
					<Header />
					<div className="manage-users-container">
						<div className="user-pic-profile">
							<button className="change-role-menu-icon">|</button>
							<div>
								<img
									src="default_user_image.jpg"
									alt="User_Avatar"
									className="user-avatar"
								/>
							</div>
							<div>
								<p>User Name</p>
							</div>
						</div>

						<p>Search a user here:</p>

						<br />
						<div>
							<Select
								name="university"
								value={value}
								options={this.state.users}
								onChange={this.handleChange}
							/>
							<div>{this.state.roleInfo}</div>
							<span>
								<p>Change user to:</p>
							</span>
							<button
								type="button"
								className="btn btn-success"
								onClick={() => this.updateRole('regular')}
							>
								Regular
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => this.updateRole('admin')}
							>
								Admin
							</button>
							<button
								type="button"
								className="btn btn-error"
								onClick={() => this.updateRole('superadmin')}
							>
								Super Admin
							</button>
						</div>
					</div>
				</div>
			);
		} else {
			return <div>Page not available for you!</div>;
		}
	}
}

export default AdminDashboard;
