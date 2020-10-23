import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export class Component1 extends Component {
	state = {
		users: [],
		clientId: null,
	}

	componentDidMount() {
		fetch('http://localhost:3000/users')
			.then(response => response.json())
			.then(users => {
				this.setState({ users, clientId: 9 });
			});
	}

	getID() {
		return this.state.id
	}

	render() {
		const { users } = this.state;

		return <div>
			<Link to={`/update/${this.state.clientId}`}>This is a link to /update</Link>
			<ul>
				{users.map(user => <li key={user.id}>{user.name}</li>)}
			</ul>
		</div>
	}
}