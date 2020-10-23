import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export class Component2 extends Component {
	state = {
		users: [],
		name: '',
	}

	componentDidMount() {
		fetch('http://localhost:3000/users')
			.then(response => response.json())
			.then(users => {
				this.setState({ users });
			});
	}

	handleNameInput = (event) => {
		const name = event.target.value;

		this.setState({ name });
	}

	handleButtonPress = () => {
		const { name } = this.state
		fetch('http://localhost:3000/users', {
			method: 'POST',
			body: JSON.stringify({ name }),
			headers: {
				'Content-type': 'application/json',
			}
		})
				.then(() => { 
					alert("User created");
					this.setState({ name: ''});
				})
	}

	render() {
		const { users } = this.state;
		const { name } = this.state;

		return <div>
			<Link to="/">This is a link to main page</Link>
			<ul>
				{users.map(user => <li key={user.id}>{user.username}</li>)}
			</ul>

			<input type="text" name="name" placeholder="username" onChange={this.handleNameInput} value={name}/> <br />
			<input type="button" value="Create" onClick={this.handleButtonPress} disabled={!name.length}/>
		</div>
	}
}