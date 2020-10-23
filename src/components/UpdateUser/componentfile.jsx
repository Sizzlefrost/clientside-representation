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
		console.log(`CRUD: props received, running function: ${this.props.getId("http://localhost:8080/update/")}`)
		fetch('http://localhost:3000/users')
		.then(response => response.json())
		.then(users => { 
			let UID = parseInt(this.props.getId("http://localhost:8080/update/")) + 1;
			console.log(`CRUD: UID ${UID}`)
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
		fetch(`http://localhost:3000/users/${parseInt(this.props.getId("http://localhost:8080/update/")) - 1}`, {
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
			alert(`${state.firstName} ${state.lastName}: user's profile changes applied!`)
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

	deleteSend = () => {

	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ 
			[name]: value	
		});
	}

	toggleCheckbox = (event) => {
		const checked = event.target.checked;
		this.setState((prevState) => { this.state.approved = !this.state.approved });
	}

	render() {
		const state = this.state;
		console.log(`CRUD: State ${this.state.firstName}`)

		return <div>
			<h1>Collaborator page: {state.firstName} {state.lastName}</h1>
			
				<label htmlFor="firstName">First name:</label> <input type="text" name="firstName" placeholder="Alex" onChange={this.handleInputChange} value={state.firstName}/> <br />
				<label htmlFor="lastName">Last name:</label> <input type="text" name="lastName" placeholder="Bloodwell" onChange={this.handleInputChange} value={state.lastName}/> <br />
				<label htmlFor="email">E-mail:</label> <input type="text" name="email" placeholder="ab@c.net" onChange={this.handleInputChange} value={state.email}/> <br />
				<label htmlFor="password">Password:</label> <input type="text" name="password" placeholder="supersecret123" onChange={this.handleInputChange} value={state.password}/> <br />
				<label htmlFor="clientId">Internal client ID:</label> <input type="text" name="clientId" placeholder="9001fake" disabled={true} value={state.clientId}/> <br />
				<label htmlFor="approved">Approved:</label> <input type="checkbox" name="approved" value={state.approved} onChange={this.toggleCheckbox} checked={state.approved}/> <br />
				<input type="button" value="Update" onClick={this.updateSend} disabled={!state.email.length}/> <br />
			
			<Link to="/">Main page</Link>
		</div>
	}
}