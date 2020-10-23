import React, { Component } from 'react';
import ReactDom from 'react-dom';

import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';

import { Component1 } from './components/Component1';
import { Component2 } from './components/Component2';
import { UserCreationComponent } from './components/CreateUser';
import { UserUpdateComponent } from './components/UpdateUser';

//Bicycle Theft tracking app project: CRUD app - create/read/update/delete

export class App extends Component {
	

	render() {
		return (
			<div>
				<Switch>
					<Route path="/smth" component={ Component2 }/>
					<Route path="/create" component={ UserCreationComponent }/>			
					<Route path="/update/:id" render={() => (<UserUpdateComponent getId={(urlBefore) => {
						let url = document.URL;
						return url.substring(urlBefore.length)}} />)} />
					<Route exact path="/" component={ Component1 }/>
				</Switch>
			</div>
		);
	}
}

ReactDom.render(
	<BrowserRouter><App /></BrowserRouter>, 
	document.getElementById('root'),
)