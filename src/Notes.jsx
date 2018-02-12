import React, { Component } from 'react';
import cookie from 'react-cookies';
import ShowNotes from './ShowNotes';
import './App.css';

class Notes extends Component {
	state = {
		loggedInUser: '',
	};

	componentWillMount() {
		this.setState({ loggedInUser: cookie.select(/loggedinuser/g) });
	}

	render() {
		if (this.state.loggedInUser.loggedinuser !== undefined) {
			return (
				<div className="App">
					<ShowNotes />
				</div>
			);
		} else {
			return <div>Please login to view this page!</div>;
		}
	}
}

export default Notes;
