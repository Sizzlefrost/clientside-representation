import React, { Component } from 'react';

import { Link, Route, Redirect, Switch } from 'react-router-dom';

export class UserAuthorizationComponent extends Component {
	state = {
		email: "",
		password: "",

		redirect: false,
	}

	submit = () => {
		const state = this.state
		fetch(`http://84.201.129.203:8888/api/auth/sign_in`, {
			method: 'POST',
			body: JSON.stringify({ 
				"email": state.email,  
				"password": state.password }),
			headers: {
				'Content-type': 'application/json',
			}
		})
		.then((response) => response.json())
		.then((data) => {
			localStorage.setItem("token", data.token); //save the received token to local storage
			this.setState((prevState) => {this.state.redirect = true});
		})
		.then(()=>{this.forceUpdate()});
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ 
			[name]: value	
		});
	}

	toggleCheckbox = (event) => {
		const name = event.target.name;
		const checked = event.target.checked;

		if (name == "passwordToggle") {
			const pwdfield = document.getElementById("password")
			if (checked == true) { pwdfield.type = "text" } else { pwdfield.type = "password" };
		};
	}

	render() {
		const state = this.state;

		if (state.redirect === false) {
			return <div>
				<h1>Sign in</h1>
			
				<input type="email" name="email" placeholder="e-mail" onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="passwordToggle">Password visibility:</label> <input type="checkbox" name="passwordToggle" onChange={this.toggleCheckbox} value={true}/> <br />
				<input type="password" id="password" name="password" placeholder="password" onChange={this.handleInputChange} value={state.password}/> <br />
				
				<input type="button" value="Sign in" onClick={this.submit} disabled={!state.email.length || !state.password.length}/> <br />

				<span>Or <Link to="/createUser">sign up</Link></span>
			</div>
		} else {
			return <div>
				<Redirect to="/collaborators"/>
			</div> /*this renders a redirect (thus sending you forward after you sign in) after you've been verified*/
		}
	}
}