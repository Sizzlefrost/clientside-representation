import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Create.css';

export class CaseCreationComponent extends Component {
	getCurrentDate = () => {
		let cdate = new Date(); //to YYYY-MM-DD
		const cyear = cdate.getFullYear().toString();
		let cmonth = (cdate.getMonth()+1).toString();
		if (cmonth < 10) { cmonth = "0".concat(cmonth) };
		let cday = cdate.getDate().toString();
		if (cday < 10) { cday = "0".concat(cday) };
		cdate = cyear.concat(".".concat(cmonth.concat(".".concat(cday))));
		return cdate
	}

	state = {
		status: 'new', 						//mandatory; new || in_progress || done
		date: this.getCurrentDate(),		//optional; date of report creation
		licenseNumber: '',					//mandatory
		color: '',							//mandatory
		type: '',							//optional; (null) || sport || general
		ownerFullName: '',					//mandatory
		officer: '',						//optional; ID of the officer-handler for the case, taken from the database
		createdAt: this.getCurrentDate(),	//mandatory; date of case creation
		updateAt: this.getCurrentDate(),	//mandatory; date of latest case update
		clientId: 'Sizzlefrost',			//mandatory; newfound info is that this is apparently ID for the project, not rly a part of the project itself
		description: '',					//optional
		resolution: '',						//optional; mandatory for closed cases (status: done)
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

		if (name === "type_ " || name === "type_sport" || name === "type_general") {
			this.setState({ 
				type: name.substring(name.indexOf("type_") + "type".length)	
			});
		}		
	}

	signUp = () => {
		const state = this.state;

		//check authorization
		if (!localStorage.getItem("token")) { return }; //TODO
		
		fetch('http://84.201.129.203:8888/api/cases', { //post a new case
			method: 'POST',
			body: JSON.stringify({ 
				"status": state.status, 
				"date": state.date,	
				"licenseNumber": state.licenseNumber,	
				"color": state.color,	
				"type": state.type,
				"ownerFullName": state.ownerFullName,
				"officer": state.officer,
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
	}

	render() {
		const state = this.state;

		return <div>
			<h1>Create a new case</h1>
			<form>
				<input type="text" name="status" placeholder="Case status" onChange={this.handleInputChange} value={state.status}/> <br />
				<input type="text" name="date" placeholder="Date of report" onChange={this.handleInputChange} value={state.date} disabled={true}/> <br />
				<input type="number" name="licenseNumber" placeholder="License number" onChange={this.handleInputChange} value={state.licenseNumber}/> <br />
				<input type="text" name="color" placeholder="Colour" onChange={this.handleInputChange} value={state.color}/> <br />
				<div className="dropdown">
					<button className="dropbtn" value={state.type}/>
					<form className="dropdown-content">
						<div className="dropdown-single">
							<label htmlFor="type_"> </label>
							<input type="radio" name="type_ " value="" onChange={this.handleRadioSelect}/>
						</div>
						<div className="dropdown-single">
							<label htmlFor="type_sport">Sport</label>
							<input type="radio" name="type_sport" value="sport" onChange={this.handleRadioSelect}/>
						</div>
						<div className="dropdown-single">
							<label htmlFor="type_sport">General</label>
							<input type="radio" name="type_general" value="general" onChange={this.handleRadioSelect}/>
						</div>
					</form>
				</div> <br />
				<input type="text" name="ownerFullName" placeholder="Full name of bike owner" onChange={this.handleInputChange} value={state.ownerFullName}/> <br />
				<input type="text" name="officer" placeholder="ID of case handler" onChange={this.handleInputChange} value={state.officer}/> <br />				
				<input type="text" name="createdAt" placeholder="Date of case creation" onChange={this.handleInputChange} value={state.createdAt} disabled={true}/> <br />
				<input type="text" name="updateAt" placeholder="Date of latest update" onChange={this.handleInputChange} value={state.updateAt} disabled={true}/> <br />
				<input type="number" name="clientId" placeholder="Client ID" onChange={this.handleInputChange} value={state.clientId} disabled={true}/> <br />
				<input type="text" name="description" placeholder="Case description" onChange={this.handleInputChange} value={state.description}/> <br />
				<input type="text" name="resolution" placeholder="Case resolution summary" onChange={this.handleInputChange} value={state.resolution}/> <br />
				<input type="button" value="Create" onClick={this.signUp}/> <br />
			</form>
			<Link to="/">Main page</Link>
		</div>
	}
}