import React, { Component } from 'react';
import './Navbar.css';

import { Redirect } from 'react-router-dom';

export class NavBarComponent extends Component {
	state = {
		authorized: false,
		init: false,
	}

	signOut(self) {
		localStorage.removeItem('token');
		this.setState((prevState) => {
			this.state.authorized = false;
		});
		this.forceUpdate();
	}

	componentDidMount() { //check initial auth status; default is false, so we set it to true if we're authorized
		if (localStorage.getItem("token")) { //if we have a token stored, we're authorized
			this.setState((prevState) => {
				this.state.authorized = true;
			});
		}
		this.state.init = true;
		this.forceUpdate();
	}

	componentDidUpdate() { //when the "updating" prop is updated, we check whether we're authorized; at this point it could be anything
		console.log(`Receiving props: ${this.props.updating || "none"}`);
		if (this.props.updating == true) {
			if (localStorage.getItem("token")) { //if we have a token stored, we're authorized
				this.setState((prevState) => {
					this.state.authorized = true;
				});
			} else {							//else, we're not
				this.setState((prevState) => {
					this.state.authorized = false;
				});
			}
		}
	}

	render() {
		const self = this;

		if (this.state.init == false) {return null};

		console.log(`Auth status: ${this.state.authorized}`);

		let auth = (this.state.authorized && <button onClick={function() {return self.signOut(self)}}>Sign out</button>) || <span style={{display: "none"}}> </span>;

		//harmless template: <span style={{display: "none"}}> </span>
		//redirect template: <Redirect to="/auth" />
		
		return <div className="navbar">
			<h1>BikeSecure</h1>	

			{auth}
		</div>
	}
}