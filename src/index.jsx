import React, { Component } from 'react';
import ReactDom from 'react-dom';

import "./css/styles.css";

import { BrowserRouter, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { NavBarComponent } from './components/Main/Navbar';
//import { FrontPageComponent } from './components/Main/Frontpage';
 
import { CaseCreationComponent } from './components/Case/Create';
//import { CaseUpdateComponent } from './components/Case/Update';
import { CaseListComponent } from './components/Case/List';

import { UserCreationComponent } from './components/User/Create';
import { UserAuthorizationComponent } from './components/User/Auth';
import { UserUpdateComponent } from './components/User/Update';
import { UserListComponent } from './components/User/List';

//Bicycle Theft tracking app project: CRUD app - create/read/update/delete

export class App extends Component {
	
	//Ralliterated Render Routing Remarks
	//first route that matches, goes through; therefore for home page we have to specify "exact" or it'll override other pages' routing
	//update uses the :id argument, so we pass a function in props that extracts
	render() {
		const passedIdPuller = function(urlBefore) {
			let url = document.URL;
			return url.substring(urlBefore.length)
		}

		return (
			<div>
				<NavBarComponent />
				<Switch>
					<Redirect exact from="/" to="/auth"/>
					<Route path="/report" component={ CaseCreationComponent } />
					<Route path="/createCase" component={ CaseCreationComponent } />
					<Route path="/cases" component={ CaseListComponent } />
					<Route path="/auth" component={ UserAuthorizationComponent }/>
					<Route path="/collaborators" component={ UserListComponent }/>
					<Route path="/createUser" component={ UserCreationComponent }/>			
					<Route path="/updateUser/:id" render={() => (<UserUpdateComponent getId={passedIdPuller} />)}/>
				</Switch>
			</div>
		);
	}
}

ReactDom.render(
	<BrowserRouter><App /></BrowserRouter>, 
	document.getElementById('root'),
)