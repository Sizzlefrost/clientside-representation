import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './createUser.css';

export class UserCreationComponent extends Component {
	state = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		password2: '',
		clientId: 'Sizzlefrost',
		approved: false,
		passwordFieldType: "password",
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ 
			[name]: value	
		});
	}

	handlePasswordToggle = (event) => {
		const state = this.state
		const checked = event.target.checked;

		const btn = document.getElementById("password")
		const btn2 = document.getElementById("password2")

		if (checked == true) {
			btn.type = "text";
			btn2.type = "text";
		} else {
			btn.type = "password";
			btn2.type = "password";
		}
	}

	signUp = () => {
		const state = this.state;

		if (state.password !== state.password2) {
			alert("Passwords don't match! Please ensure you've entered them correctly, then try again.")
			return
		} else {
			fetch('http://84.201.129.203:8888/api/auth/sign_up', { //post to signup address with the collaborator details
				method: 'POST',
				body: JSON.stringify({ 
					"email": state.email, 
					"firstName": state.firstName, 
					"lastName": state.lastName, 
					"password": state.password, 
					"repassword": state.password2, 
					"clientId": state.clientId, 
					"approved": false}),
				headers: {
					'Content-type': 'application/json',
				}
			})
		};
	}

	render() {
		const state = this.state;

		return <div className='createUserForm'>
			<h1>Create a new collaborator account</h1>
			<form>
				<input type="text" name="firstName" placeholder="First name" onChange={this.handleInputChange} value={state.firstName}/> <br />
				<input type="text" name="lastName" placeholder="Last name" onChange={this.handleInputChange} value={state.lastName}/> <br />
				<input type="email" name="email" placeholder="E-mail" onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="passwordToggle">Password visibility:</label> <input type="checkbox" name="passwordToggle" onChange={this.handlePasswordToggle} value={true}/> <br />
				<input type="password" name="password" id="password" placeholder="Password" onChange={this.handleInputChange} value={state.password}/> <br />
				<input type="password" name="password2" id="password2" placeholder="Password again" onChange={this.handleInputChange} value={state.password2}/> <br />
				<input type="button" value="Create" onClick={this.signUp} disabled={!state.email.length}/> <br />
			</form>
			<Link to="/collaborators">Main page</Link>
		</div>
	}
}