import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class DashboardButton extends Component {
	state = {
		userType: '',
	};

	componentWillMount() {
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
	}

	render() {
		if (this.state.userType === 'superadmin') {
			return (
				<Link to="/dashboard">
					<button className="btn btn-primary" type="button">
						Dashboard
					</button>
				</Link>
			);
		} else {
			return <div />;
		}
	}
}

export default DashboardButton;
