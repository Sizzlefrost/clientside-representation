import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
const dateFormat = require ("dateFormat");
import '../../Common/Dropdown.css';
import './List.css';

export class CaseListComponent extends Component {
	state = {
		cases: [],

		caseTracker: 0,

		authFlag: false,
	}

	componentDidMount() {
		//console.log(localStorage.getItem("token"));
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authFlag=true}); this.render();return}; //redirect to main
		fetch('http://84.201.129.203:8888/api/cases', {headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
			.then(response => response.json())
			.then(cases => {
				this.setState({cases});
			})
			.then(()=>{return});
	}

	handleRadioSelect = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		const eid = this.state.caseTracker;

		const caseData = this.state.cases[eid];
		fetch(`http://84.201.129.203:8888/api/cases/${caseData._id}`, {
			method: 'PUT',
			body: JSON.stringify({ 
				"status": caseData.status,
				"date": caseData.date,
				"licenseNumber": caseData.licenseNumber,
				"color": caseData.color,
				"type": caseData.type,
				"ownerFullName": caseData.ownerFullName,
				"officer": caseData.officer,
				"createdAt": caseData.createdAt,
				"updateAt": caseData.updateAt,
				"clientId": caseData.clientId,
				"description": caseData.description,
				"resolution": caseData.resolution, 
			}),
			headers: {
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then(()=>{
			this.setState((prevState) => { 
				this.state.cases[eid].[name] = value;
				this.forceUpdate();
			});
		});
	}

	interpretValues(techValue) {
		switch (techValue) {
			case ("new"):
				return "New";
			case ("in_progress"):
				return "In progress";
			case ("done"):
				return "Concluded";
			case ("general"):
				return "General";
			case ("sport"):
				return "Sport";
			default:
				return "Error";
		}
	}

	formatTableRows(cases) {
		const self = this;
		const state = self.state;
		let result = [];

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

		for (let i = 0; i <= cases.length - 1; i++) {
			state.caseTracker = i;
			if (!cases[i]) {return};

			let status = <div className="dropdown">
					<button className="dropbtn"> {self.interpretValues(state.cases[i].status)} </button>
					<form className={((state.cases[i].status != "done") && "dropdown-content") || "dropdown-hidden"}>
						<div className="dropdown-single">
							<label htmlFor={"new".concat(i.toString())}>New</label>
							<input type="radio" name="status" id={"new".concat(i.toString())} value="new" onChange={self.handleRadioSelect} />
						</div>
						<div className="dropdown-single">
							<label htmlFor={"in_progress".concat(i.toString())}>In progress</label>
							<input type="radio" name="status" id={"in_progress".concat(i.toString())} value="in_progress" onChange={self.handleRadioSelect} />
						</div>
						<div className="dropdown-single">
							<label htmlFor={"done".concat(i.toString())}>Concluded</label>
							<input type="radio" name="status" id={"done".concat(i.toString())} value="done" onChange={self.handleRadioSelect} />
						</div>
					</form>
				</div>;

			let link = <Link to={"/updateCase/".concat((i+1).toString())}>Case page {i+1}</Link>;

			let remove = <input type="button" id={"RemoveBtn".concat(i.toString())} value="Delete" onClick={function() {return self.deleteCase(i+1)}}/>;

			result[i+1] = <tr key={i+1}>
				<td>{status}</td>
				<td>{cases[i].licenseNumber}</td>
				<td>{cases[i].color}</td>
				<td>{this.interpretValues(cases[i].type)}</td>
				<td>{cases[i].ownerFullName}</td>
				<td>{cases[i].officer || "-"}</td>
				<td>{dateFormat(cases[i].createdAt, "isoDate")}</td>
				<td>{dateFormat(cases[i].updateAt, "isoDate")}</td>
				<td><div className="link">{link}</div></td>
				<td>{remove}</td>
			</tr>;
		}

		return result;
	}

	deleteCase(caseID) {
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authFlag=true})}; //redirect to main

		const caseData = this.state.cases[caseID-1];
		fetch(`http://84.201.129.203:8888/api/cases/${caseData._id}`, {method: "DELETE", headers: {"Authorization": "Bearer ".concat(localStorage.getItem("token").toString())}})
		this.setState((prevState) => { 
			delete this.state.cases[caseID-1];
			setTimeout( () => { //asyncronous to make sure the setState goes through first
				this.forceUpdate();
			}, 200); 
		})
	}

	signOut(self) {
		localStorage.removeItem('token');
		self.state.authFlag = true;
		self.forceUpdate();
	}

	render() {
		const { cases } = this.state;

		let link = (this.state.authFlag && <Redirect to="/auth"/>) || (<Link to="/createCase">Create a new case</Link>);
		let self = this;

		let table = this.formatTableRows(cases)

		return <div>
			<h1 className="title" style={{marginLeft: 5 + 'ex'}}>List of BikeSecure cases</h1>
			<table className="caseList">
				<tbody>
					{table}
				</tbody>
			</table>
			<br/><br/><br/>
			<div className="caseList">{link}</div> <br/>
		</div>
	}
}