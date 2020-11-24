import React, { Component } from 'react';

import { Link, Route, Redirect, Switch } from 'react-router-dom'
import './auth.css';

export class UserAuthorizationComponent extends Component {
	state = {
		email: "",
		password: "",

		redirect: false,
	}

	componentDidMount() {	
		if (localStorage.getItem("token")) {this.setState((prevState)=>{this.state.redirect=true; this.forceUpdate()})}; //check auth
	}

	chkEnter = (e) => {
		const ENTER = 13;

		if (e.keyCode == ENTER) {this.submit()};
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
			if (!data.token) {alert('Invalid account!'); return};
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
				<h2>Sign in</h2>
			
				<input type="email" name="email" placeholder="e-mail" onKeyDown={this.chkEnter} onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="passwordToggle">Password visibility:</label> <input type="checkbox" name="passwordToggle" onChange={this.toggleCheckbox} value={true}/> <br />
				<input type="password" id="password" name="password" placeholder="password" onKeyDown={this.chkEnter} onChange={this.handleInputChange} value={state.password}/> <br />
				
				<input type="submit" value="Sign in" onClick={this.submit} disabled={!state.email.length || !state.password.length}/> <br />

				<span>Or <Link to="/createUser">sign up</Link></span>
			</div>
		} else {
			return <div>
				<Redirect to="/collaborators"/>
			</div> /*this renders a redirect (thus sending you forward after you sign in) after you've been verified*/
		}
	}
}