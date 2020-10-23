import React, { Component } from 'react';

import { Link } from 'react-router-dom';

//TODO: add styling

export class UserCreationComponent extends Component {
	state = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		password2: '',
		clientId: '',
		approved: false,
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ 
			[name]: value	
		});
	}

	signUp = () => {
		//future signup address: http://84.201.129.203:8888/api/users/sign_up
		//future get cliend id address: http://84.201.129.203:8888/api/officers (returns 403 forbidden for now)
		const state = this.state
		fetch('http://localhost:3000/users') //get list of users to generate a unique clientId
			.then(response => response.json())
			.then(users => state.clientId = users.length + 1)
			.then(() => fetch('http://localhost:3000/users', { //post to signup address with the collaborator details
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
				}))
			.then(() => { //reset form
				this.setState({ 
					firstName: '',
					lastName: '',
					email: '',
					password: '',
					password2: '',
					clientId: '',
					approved: false,
				});
			})
	}

	render() {
		const state = this.state;

		return <div>
			<h1>Create a new collaborator account</h1>
			
			<input type="text" name="firstName" placeholder="First name" onChange={this.handleInputChange} value={state.firstName}/> <br />
			<input type="text" name="lastName" placeholder="Last name" onChange={this.handleInputChange} value={state.lastName}/> <br />
			<input type="text" name="email" placeholder="E-mail" onChange={this.handleInputChange} value={state.email}/> <br />
			<input type="text" name="password" placeholder="Password" onChange={this.handleInputChange} value={state.password}/> <br />
			<input type="text" name="password2" placeholder="Password again" onChange={this.handleInputChange} value={state.password2}/> <br />
			<input type="button" value="Create" onClick={this.signUp} disabled={!state.email.length}/> <br />
			<Link to="/">Main page</Link>
		</div>
	}
}