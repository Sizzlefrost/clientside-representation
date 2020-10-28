import React, { Component } from 'react';
import ReactDom from 'react-dom';

import "./css/styles.css";

import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';

import { UserListComponent } from './components/User/List';
import { UserCreationComponent } from './components/User/Create';
import { UserUpdateComponent } from './components/User/Update';

//Bicycle Theft tracking app project: CRUD app - create/read/update/delete

export class App extends Component {
	
	//Ralliterated Render Routing Remarks
	//first route that matches, goes through; therefore for home page we have to specify "exact" or it'll override other pages' routing
	//update uses the :id argument, so we pass a function in props that extracts
	render() {
		return (
			<div>
				<Switch>
					<Route exact path="/" component={ UserListComponent }/>
					<Route path="/create" component={ UserCreationComponent }/>			
					<Route path="/update/:id" render={() => (<UserUpdateComponent getId={(urlBefore) => {
						let url = document.URL;
						return url.substring(urlBefore.length)}} />)} />
				</Switch>
			</div>
		);
	}
}

ReactDom.render(
	<BrowserRouter><App /></BrowserRouter>, 
	document.getElementById('root'),
)