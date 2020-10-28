import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export class UserUpdateComponent extends Component {
	state = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		password2: '',
		clientId: '',
		approved: false,
	}

	componentDidMount() {
		//future fetch user by id address: http://84.201.129.203:8888/api/officers/:id | therefore function will test http://84.201.129.203:8888/api/officers/
		fetch('http://localhost:3000/users')
		.then(response => response.json())
		.then(users => { 
			let UID = parseInt(this.props.getId("http://localhost:8080/update/")) - 1;
			//TODO: replace the alert with a redirect to generic userlist
			if (!users[UID]) { alert(`The userdata you are trying to access does not exist.`) } else 
				this.setState({
					email: users[UID].email,
					firstName: users[UID].firstName,
					lastName: users[UID].lastName,
					password: users[UID].password,
					password2: users[UID].password,
					clientId: users[UID].clientId,
					approved: users[UID].approved,
				
			})
		});
	}

	updateSend = () => {
		//future signup address: http://84.201.129.203:8888/api/users/sign_up
		//future get client id address: http://84.201.129.203:8888/api/officers (returns 403 forbidden for now)
		const state = this.state
		fetch(`http://localhost:3000/users/${parseInt(this.props.getId("http://localhost:8080/update/"))}`, {
			method: 'PUT',
			body: JSON.stringify({ 
				"email": state.email, 
				"firstName": state.firstName, 
				"lastName": state.lastName, 
				"password": state.password, 
				"repassword": state.password2, 
				"clientId": state.clientId,
				"approved": state.approved }),
			headers: {
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`${state.firstName} ${state.lastName}: user's profile changes applied!`); //possibly redirect
		});
	}

	deleteSend = () => {
		const state = this.state
		fetch(`http://localhost:3000/users/${parseInt(this.props.getId("http://localhost:8080/update/"))}`, {
			method: 'DELETE',
			body: JSON.stringify({ 
				"email": state.email, 
				"firstName": state.firstName, 
				"lastName": state.lastName, 
				"password": state.password, 
				"repassword": state.password2, 
				"clientId": state.clientId,
				"approved": state.approved }),
			headers: {
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`${state.firstName} ${state.lastName}: user's profile deleted!`)
			this.setState({
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				password2: '',
				clientId: '',
				approved: false,
			});
		});
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

		if (name == "approved") {
			this.setState((prevState) => {
				this.state.approved = !this.state.approved;
			});
		};

		if (name == "passwordToggle") {
			const pwdfield = document.getElementById("password")
			if (checked == true) { pwdfield.type = "text" } else { pwdfield.type = "password" };
		};
	}

	render() {
		const state = this.state;

		return <div>
			<h1>Collaborator page: {state.firstName} {state.lastName}</h1>
			
				<label htmlFor="firstName">First name:</label> <input type="text" name="firstName" placeholder="Alex" onChange={this.handleInputChange} value={state.firstName}/> <br />
				<label htmlFor="lastName">Last name:</label> <input type="text" name="lastName" placeholder="Bloodwell" onChange={this.handleInputChange} value={state.lastName}/> <br />
				<label htmlFor="email">E-mail:</label> <input type="text" name="email" placeholder="ab@c.net" onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="passwordToggle">Password visibility:</label> <input type="checkbox" name="passwordToggle" onChange={this.toggleCheckbox} value={true}/> <br />
				<label htmlFor="password">Password:</label> <input type="password" id="password" name="password" placeholder="supersecret123" onChange={this.handleInputChange} value={state.password}/> <br />
				<label htmlFor="clientId">Internal client ID:</label> <input type="text" name="clientId" placeholder="9001fake" disabled={true} value={state.clientId}/> <br />
				<label htmlFor="approved">Approved:</label> <input type="checkbox" id="approved" name="approved" value={state.approved} onChange={this.toggleCheckbox}/> <br />
				<input type="button" value="Update" onClick={this.updateSend} disabled={!state.email.length}/> <br />
				<input type="button" value="Delete" onClick={this.deleteSend}/> <br />
			
			<Link to="/">Main page</Link>
		</div>
	}
}