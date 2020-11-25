import React, { Component, useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import "./css/styles.css";

import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { NavBarComponent } from './components/Main/Navbar';
import { FrontPageComponent } from './components/Main/Description';
 
import { CaseCreationComponent } from './components/Case/Create';
import { CaseUpdateComponent } from './components/Case/Update';
import { CaseListComponent } from './components/Case/List';

import { UserCreationComponent } from './components/User/Create';
import { UserAuthorizationComponent } from './components/User/Auth';
import { UserUpdateComponent } from './components/User/Update';
import { UserListComponent } from './components/User/List';

//Bicycle Theft tracking app project: CRUD app - create/read/update/delete

export function App() {
	const history = useHistory();
	const [currentPage, setPage] = useState(history.location.pathname);

	useEffect(() => {
		return history.listen((location) => { 
			setPage(location.pathname);
      	}) 
	},[history])
	
	const passedIdPuller = function(urlBefore) {
		let url = document.URL;
		return url.substring(urlBefore.length)
	}

	return (
		<div>
			<NavBarComponent currentPage={currentPage}/>
			<Switch>
				<Route exact path="/" component={ FrontPageComponent } />
				<Route path="/report" component={ CaseCreationComponent } />
				<Route path="/createCase" component={ CaseCreationComponent } />
				<Route path="/updateCase/:id" render={() => (<CaseUpdateComponent getId={passedIdPuller} />)}/>
				<Route path="/cases" component={ CaseListComponent } />
				<Route path="/auth" component={ UserAuthorizationComponent }/>
				<Route path="/collaborators" component={ UserListComponent }/>
				<Route path="/createUser" component={ UserCreationComponent }/>			
				<Route path="/updateUser/:id" render={() => (<UserUpdateComponent getId={passedIdPuller} />)}/>
			</Switch>
		</div>
	);
}

ReactDom.render(
	<BrowserRouter><App /></BrowserRouter>, 
	document.getElementById('root'),
)