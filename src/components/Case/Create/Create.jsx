import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../Common/Dropdown.css';
const dateFormat = require ("dateFormat");

export class CaseCreationComponent extends Component {
	getCurrentDate = () => {
		let cdate = new Date(); //to YYYY-MM-DD
		return dateFormat(cdate, "isoDate")
	}

	state = {
		status: 'new', 						//mandatory; new || in_progress || done
		date: this.getCurrentDate(),		//optional; date of report creation
		licenseNumber: '-840',				//mandatory
		color: 'Unknown',					//mandatory
		type: 'general',					//optional; sport || general
		ownerFullName: '',					//mandatory
		officer: '',						//optional; ID of the officer-handler for the case, taken from the database
		createdAt: this.getCurrentDate(),	//mandatory; date of case creation
		updateAt: this.getCurrentDate(),	//mandatory; date of latest case update
		clientId: 'Sizzlefrost',			//mandatory; newfound info is that this is apparently ID for the project, not rly a part of the project itself
		description: '',					//optional
		resolution: '',						//optional; mandatory for closed cases (status: done)

		authorized: true,
	}

	componentDidMount() {
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authorized=false})}; //check auth
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState({ 
			[name]: value	
		});
	}

	handleRadioSelect = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({ 
			[name]: value
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

	signUp = () => {
		const state = this.state;

		if (state.authorized === true) { //used on the authorized case creation page
			fetch('http://84.201.129.203:8888/api/cases', { //post a new case
				method: 'POST',
				body: JSON.stringify({ 
					"status": state.status, 
					"date": state.date,	
					"licenseNumber": state.licenseNumber,	
					"color": state.color,	
					"type": state.type || "general",
					"ownerFullName": state.ownerFullName,
					"createdAt": state.createdAt,
					"updateAt": state.updateAt,
					"clientId": state.clientId,
					"description": state.description,
					"resolution": state.resolution,}),
				headers: {
					'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
					'Content-type': 'application/json',
				}
			});
		} else { //used on the unauthorized report creation page		
			fetch('http://84.201.129.203:8888/api/public/report', { //post a new case
				method: 'POST',
				body: JSON.stringify({ 
					"status": state.status, 
					"date": state.date,	
					"licenseNumber": state.licenseNumber,	
					"color": state.color,	
					"type": state.type,
					"ownerFullName": state.ownerFullName,
					"createdAt": state.createdAt,
					"updateAt": state.updateAt,
					"clientId": state.clientId,
					"description": state.description,}),
				headers: {
					'Content-type': 'application/json',
				}
			});
		}		
	}

	render() {
		const state = this.state;

		return <div>
			<h2>Create a new case</h2>
			<form>
				<label htmlFor="status"> Case status: </label>
				<div className="dropdown">
					<button className="dropbtn">{this.interpretValues(state.status)}</button>
					<form className="dropdown-content">
					<div className="dropdown-single">
						<label htmlFor="new">{this.interpretValues("new")}</label>
						<input type="radio" name="status" id="new" value="new" onChange={this.handleRadioSelect}/>
					</div>
					<div className="dropdown-single">
						<label htmlFor="in_progress">{this.interpretValues("in_progress")}</label>
						<input type="radio" name="status" id="in_progress" value="in_progress" onChange={this.handleRadioSelect}/>
					</div>
					<div className="dropdown-single">
						<label htmlFor="done">{this.interpretValues("done")}</label>
						<input type="radio" name="status" id="done" value="done" onChange={this.handleRadioSelect}/>
					</div>
					</form>
				</div> <br />

				<label htmlFor="date"> Date of report: </label>
				<input type="text" name="date" placeholder="Date of report" onChange={this.handleInputChange} value={state.date} disabled={true}/> <br />

				<label htmlFor="licenseNumber"> Bike license number: </label>
				<input type="string" name="licenseNumber" placeholder="License number" onChange={this.handleInputChange} value={state.licenseNumber}/> <br />

				<label htmlFor="status"> Bike colour: </label>
				<input type="text" name="color" placeholder="Colour" onChange={this.handleInputChange} value={state.color}/> <br />

				<label htmlFor="type"> Bike type: </label>
				<div className="dropdown">
					<button className="dropbtn"> {this.interpretValues(state.type)} </button>
					<form className="dropdown-content">
						<div className="dropdown-single">
							<label htmlFor="sport">{this.interpretValues("sport")}</label>
							<input type="radio" name="type" id="sport" value="sport" onChange={this.handleRadioSelect}/>
						</div>
						<div className="dropdown-single">
							<label htmlFor="general">{this.interpretValues("general")}</label>
							<input type="radio" name="type" id="general" value="general" onChange={this.handleRadioSelect}/>
						</div>
					</form>
				</div> <br />

				<label htmlFor="status"> Full name of bike user: </label>
				<input type="text" name="ownerFullName" placeholder="Full name of bike owner" onChange={this.handleInputChange} value={state.ownerFullName}/> <br />

				<label htmlFor="status"> Case handler: </label>
				<input type="text" name="officer" placeholder="ID of case handler" onChange={this.handleInputChange} value={state.officer}/> <br />

				{console.log(state.authorized, localStorage.getItem("token"))}
				<label htmlFor="status"> Case creation date: </label>			
				<input style={{display: (state.authorized && " inline") || " none"}} type="text" name="createdAt" placeholder="Date of case creation" onChange={this.handleInputChange} value={state.createdAt} disabled={true}/> <br />

				<label htmlFor="status"> Case description: </label>
				<input className="extendedField" type="text" name="description" placeholder="Case description" onChange={this.handleInputChange} value={state.description}/> <br />

				<label htmlFor="status"> Case resolution comment: </label>
				<input className="extendedField" type="text" name="resolution" placeholder="Case resolution summary" onChange={this.handleInputChange} value={state.resolution}/> <br />

				<input type="button" value="Create" onClick={this.signUp}/> <br />
			</form>
			<Link to="/cases">Main page</Link>
		</div>
	}
}