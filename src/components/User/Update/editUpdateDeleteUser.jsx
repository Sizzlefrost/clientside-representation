import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export class UserUpdateComponent extends Component {
	state = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		clientId: 'Sizzlefrost',
		approved: false,

		UID: parseInt(this.props.getId("http://localhost:8080/updateUser/")), //clientside user ID, calculated from page URL, which is generated off the userlist
		SUID: '', //serverside user ID, assigned by the server and involves a long string rather than a simple number
	}

	componentDidMount() {
		if (!localStorage.getItem("token")) {return}; //unauthorized; redirect to sign-in

		fetch('http://84.201.129.203:8888/api/officers/', {headers: {'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString())}})
		.then(response => response.json())
		.then(users => { 
			let UID = this.state.UID - 1;
			//TODO: replace the alert with a redirect to generic userlist
			if (!users[UID]) { alert(`The userdata you are trying to access does not exist.`) } else 
				this.setState({
					email: users[UID].email,
					firstName: users[UID].firstName,
					lastName: users[UID].lastName,
					password: users[UID].password, //returns hashed, I'll keep requesting it as a temp option.
					clientId: users[UID].clientId,
					approved: users[UID].approved,
					SUID: users[UID]._id, //fetch the serverside user ID, to include in further requests
			})
		});
	}

	updateSend = () => {
		if (!localStorage.getItem("token")) {return}; //unauthorized; redirect to sign-in
		const state = this.state
		fetch(`http://84.201.129.203:8888/api/officers/${this.state.SUID}`, {
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
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`${state.firstName} ${state.lastName}: user's profile changes applied!`); //possibly redirect
		});
	}

	deleteSend = () => {
		if (!localStorage.getItem("token")) {return}; //unauthorized; redirect to sign-in

		const state = this.state
		fetch(`http://84.201.129.203:8888/api/officers/${this.state.SUID}`, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`${state.firstName} ${state.lastName}: user's profile deleted!`) //redirect
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
				this.state.approved = checked;
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
			<h2>Collaborator page: {state.firstName} {state.lastName}</h2>
			
				<label htmlFor="firstName">First name:</label> <input type="text" name="firstName" placeholder="Alex" onChange={this.handleInputChange} value={state.firstName}/> <br />
				<label htmlFor="lastName">Last name:</label> <input type="text" name="lastName" placeholder="Bloodwell" onChange={this.handleInputChange} value={state.lastName}/> <br />
				<label htmlFor="email">E-mail:</label> <input type="email" name="email" placeholder="ab@c.net" onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="passwordToggle">Password visibility:</label> <input type="checkbox" name="passwordToggle" onChange={this.toggleCheckbox} value={true}/> <br />
				<label htmlFor="password">Hashed password:</label> <input type="password" id="password" name="password" placeholder="supersecret123" disabled={true} onChange={this.handleInputChange} value={state.password}/> <br />
				<label htmlFor="clientId">Internal client ID:</label> <input type="text" name="clientId" placeholder="9001fake" disabled={true} value={state.clientId}/> <br />
				<label htmlFor="serverId">Internal serverside UID:</label> <input type="text" name="serverId" placeholder="9001fake" disabled={true} value={state.SUID}/> <br />
				<label htmlFor="approved">Approved:</label> <input type="checkbox" id="approved" name="approved" value={state.approved} onChange={this.toggleCheckbox}/> <br />
				<input type="button" value="Update" onClick={this.updateSend} disabled={!state.email.length}/> <br />
				<input type="button" value="Delete" onClick={this.deleteSend}/> <br />
			
			<Link to="/collaborators">Main page</Link>
		</div>
	}
}