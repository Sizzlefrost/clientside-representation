import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export class UserListComponent extends Component {
	state = {
		users: [],
	}

	componentDidMount() {
		if (!localStorage.getItem("token")) {return}; //throw an error: unauthorized
		console.log(`${localStorage.getItem("token")}`)
		fetch('http://84.201.129.203:8888/api/officers', {headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
			.then(response => response.json())
			.then(users => {
				this.setState({users});
			});
	}

	getID() {
		return this.state.id
	}

	formatTableRows(users) { //takes the users JS table and returns it formatted into HTML tags needed to construct an HTML table
		let result = [];
		result[0] = <tr key="0">
				<th>First Name</th>
				<th>Last Name</th>
				<th>E-Mail</th>
				<th>Page</th>
				<th>Approved?</th>
				<th></th>
			</tr>;

		for (let i = 0; i <= users.length - 1; i++) {
			let link = <Link to={"/updateUser/".concat((i+1).toString())}>User page {i+1}</Link> 

			let approved = users[i].approved;
			if (!approved) {approved = false};

			const self = this;
			//onClicks got ugly inside the next block. Have to wrap functions in dummy functions to avoid misfires on page load.
			//and since we wrapped like that, keyword "this" lost context, so we are pre-storing it in "self"

			if (approved == true) {
				approved = <input type="text" value="Approved" disabled={true}/>
			} else {
				approved = <input type="button" id={"ApproveBtn".concat(i.toString())} value="Approve" onClick={function() {return self.approveUser(i+1)}}/>
			};

			const remove = <input type="button" id={"RemoveBtn".concat(i.toString())} value="Delete" onClick={function() {return self.deleteUser(i+1)}}/>;

			result[i+1] = <tr key={i+1}>
				<td>{users[i].firstName}</td>
				<td>{users[i].lastName}</td>
				<td>{users[i].email}</td>
				<td>{link}</td>
				<td>{approved}</td>
				<td>{remove}</td>
			</tr>;
		}

		return result;
	}

	approveUser(userID) {
		if (!localStorage.getItem("token")) {return}; //throw an error: unauthorized

		const userData = this.state.users[userID-1];
		fetch(`http://84.201.129.203:8888/api/officers/${userID}`, {
			method: "PUT",
			body: JSON.stringify({ 
				"email": userData.email, 
				"firstName": userData.firstName, 
				"lastName": userData.lastName, 
				"password": userData.password, 
				"repassword": userData.password2, 
				"clientId": userData.clientId, 
				"approved": true}),
			headers: {
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then (() => {
			let InputTag = document.getElementById("ApproveBtn".concat((userID-1).toString()));
			InputTag.type = "text";
			InputTag.disabled = "true";
			InputTag.value = "Approved";
			delete InputTag.onClick;
			delete InputTag.id;
			this.render();
		})
	}

	deleteUser(userID) {
		if (!localStorage.getItem("token")) {return}; //throw an error: unauthorized

		const userData = this.state.users[userID-1];
		fetch(`http://84.201.129.203:8888/api/officers/${userID}`, {method: "DELETE", headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
		this.setState((prevState) => { delete this.state.users[userID-1]; this.render() })
	}

	render() {
		const { users } = this.state;

		return <div>
			<table>
				<tbody>
					{this.formatTableRows(users)}
				</tbody>
			</table>
			<br/><br/><br/>
			<Link to="/createUser">Create a new user</Link> 
		</div>
	}
}