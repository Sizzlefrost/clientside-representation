import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';

export class CaseListComponent extends Component {
	state = {
		cases: [],

		authFlag: false,
	}

	componentDidMount() {
		console.log(localStorage.getItem("token"));
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authFlag=true}); this.render();return}; //redirect to main
		fetch('http://84.201.129.203:8888/api/cases', {headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
			.then(response => response.json())
			.then(cases => {
				this.setState({cases});
			});
	}

	changeStatus(element, targetStatus) {
		this.setState((prevState) => {this.state.cases[element].status = targetStatus});

		setTimeout( () => { //asyncronous to make sure the setState goes through first
			console.log(this.state.cases[element].status);
			this.render();
		}, 200);
	}

	convertStatus(techStatus) {
		if (techStatus === "new") {return "New"}
		else {
			if (techStatus === "in_progress") {return "In progress"}
			else {return "Concluded"};
		};
	}

	formatTableRows(cases) {
		if (!cases) { cases = this.state.cases};
		let result = [];
		let self = this;

		result[0] = <tr key="0">
			<th>Status</th>
			<th>License Number</th>
			<th>Colour</th>
			<th>Type</th>
			<th>Name of Owner</th>
			<th>Responsible Collaborator</th>
			<th>Case Opening Date</th>
			<th>Last Update Date</th>
			<th>Link to page</th>
			<th> </th>
		</tr>;

		let status = <div className="dropdown">
					<button className="dropbtn"> New </button>
					<div className="dropdown-content">
						<button className="dropdown-single" > New </button>
						<button className="dropdown-single" > In progress </button>
						<button className="dropdown-single" > Concluded </button>
					</div>
				</div>;

		for (let i = 0; i <= cases.length - 1; i++) {
			console.log(self.convertStatus(this.state.cases[i].status));
			status = <div className="dropdown">
					<button className="dropbtn"> {self.convertStatus(this.state.cases[i].status)} </button>
					<div className="dropdown-content">
						<button className="dropdown-single" onClick={function() {self.changeStatus(i, "new")}}> New </button>
						<button className="dropdown-single" onClick={function() {self.changeStatus(i, "in_progress")}}> In progress </button>
						<button className="dropdown-single" onClick={function() {self.changeStatus(i, "done")}}> Concluded </button>
					</div>
				</div>;

			console.log(status);

			let link = <Link to={"/updateCase/".concat((i+1).toString())}>Case page {i+1}</Link>;

			let remove = <input type="button" id={"RemoveBtn".concat(i.toString())} value="Delete" onClick={function() {return self.deleteCase(i+1)}}/>;

			result[i+1] = <tr key={i+1}>
				<td>{status}</td>
				<td>{cases[i].licenseNumber}</td>
				<td>{cases[i].color}</td>
				<td>{cases[i].type}</td>
				<td>{cases[i].ownerFullName}</td>
				<td>{cases[i].officer}</td>
				<td>{cases[i].createdAt}</td>
				<td>{cases[i].updateAt}</td>
				<td>{link}</td>
				<td>{remove}</td>
			</tr>;
		}

		return result;
	}

	deleteCase(caseID) {
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authFlag=true})}; //redirect to main

		const caseData = this.state.cases[caseID-1];
		fetch(`http://84.201.129.203:8888/api/cases/${caseData._id}`, {method: "DELETE", headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
		this.setState((prevState) => { delete this.state.cases[caseID-1]; this.render() })
	}

	signOut(self) {
		localStorage.removeItem('token');
		self.state.authFlag = true;
		self.forceUpdate();
	}

	render() {
		const { users } = this.state;

		let link = (this.state.authFlag && <Redirect to="/auth"/>) || (<Link to="/createCase">Create a new case</Link>);
		let self = this;
		
		//console.log(this.state.authFlag, link.type.displayName || link.type);
		return <div>
			<table>
				<tbody>
					{this.formatTableRows(users)}
				</tbody>
			</table>
			<br/><br/><br/>
			{link} <br/>

			<button onClick={function() {return self.signOut(self)}}>Sign out</button>
		</div>
	}
}