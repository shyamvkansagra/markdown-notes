import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Notes from './Notes';
import AdminDashboard from './AdminDashboard';

const App = () => (
	<div className="app">
		<Route exact path="/" component={LoginPage} />
		<Route path="/notes" component={Notes} />
		<Route path="/dashboard" component={AdminDashboard} />
	</div>
);
export default App;
