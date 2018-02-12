import React, { Component } from 'react';
import axios from 'axios';
import DashboardButton from './DashboardButton';

class Header extends Component {
	logout = () => {
		axios
			.post('http://localhost:3030/logout')
			.then(response => {
				if (response.data.logout === 'successful') {
					alert('Successfully logged out!');
					window.location.href = 'http://localhost:3000';
				} else {
					alert('Cannot logout!');
				}
			})
			.catch(error => {
				console.error('axios error', error);
			});
	};

	render() {
		return (
			<header className="appHeader">
				<div className="headerContent">
					<section>
						<span className="companySignature">
							<img src="mn_logo.jpg" alt="mn_logo" />
							<p>MARKDOWN NOTES</p>
						</span>
					</section>
					<section className="navbar-section">
						<div className="input-group input-inline">
							<DashboardButton />
							<button className="btn btn-error input-group-btn" onClick={this.logout}>
								Logout
							</button>
							{/*<button class="btn btn-primary input-group-btn">Search</button>*/}
						</div>
					</section>
				</div>
			</header>
		);
	}
}

export default Header;
