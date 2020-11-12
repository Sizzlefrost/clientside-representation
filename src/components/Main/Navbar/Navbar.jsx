import React, { Component } from 'react';
import './Navbar.css';

import { Redirect } from 'react-router-dom';

export class NavBarComponent extends Component {
	state = {
		authFlag: false,
	}

	signOut(self) {
		localStorage.removeItem('token');
		self.state.authFlag = true;
		self.forceUpdate();
	}

	render() {
		const self = this;
		let auth = (this.state.authFlag && <Redirect to="/auth"/>) || (<button onClick={function() {return self.signOut(self)}}>Sign out</button>);
		
		return <div className="navbar">
			<h1>BikeSecure</h1>	

			{auth}
		</div>
	}
}