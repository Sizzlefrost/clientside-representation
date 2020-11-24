import React, { Component } from 'react';

import { Link } from 'react-router-dom';
const dateFormat = require ("dateFormat");
import '../../Common/Dropdown.css';
import './Update.css';

export class CaseUpdateComponent extends Component {
	state = {
		status: 'new', 						//mandatory; new || in_progress || done
		date: new Date,		//optional; date of report creation
		licenseNumber: '-840',				//mandatory
		color: 'Unknown',					//mandatory
		type: '',							//optional; (null) || sport || general
		ownerFullName: '',					//mandatory
		officer: '',						//optional; ID of the officer-handler for the case, taken from the database
		createdAt: new Date,	//mandatory; date of case creation
		updateAt: new Date,	//mandatory; date of latest case update
		clientId: 'Sizzlefrost',			//mandatory; newfound info is that this is apparently ID for the project, not rly a part of the project itself
		description: '',					//optional
		resolution: '',						//optional; mandatory for closed cases (status: done)

		authFlag: false,

		CID: parseInt(this.props.getId("http://localhost:8080/updateCase/")), //clientside case ID, calculated from page URL, which is generated off the caselist
		SCID: '', //serverside case ID, assigned by the server and involves a long string rather than a simple number
	}

	componentDidMount() {
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{this.state.authFlag=true}); this.render();return}; //redirect to sign-in

		fetch('http://84.201.129.203:8888/api/cases/', {headers: {'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString())}})
		.then(response => response.json())
		.then(cases => { 
			let CID = this.state.CID - 1;
			//TODO: replace the alert with a redirect to generic userlist
			if (!cases[CID]) { alert(`The case file you are trying to access does not exist.`) } else 
				this.setState({
					status: cases[CID].status,
					date: cases[CID].date,
					licenseNumber: cases[CID].licenseNumber,
					color: cases[CID].color,
					type: cases[CID].type,
					ownerFullName: cases[CID].ownerFullName,
					officer: cases[CID].officer,
					createdAt: cases[CID].createdAt,
					updateAt: cases[CID].updateAt,
					clientId: cases[CID].clientId,
					description: cases[CID].description,
					resolution: cases[CID].resolution,
					SCID: cases[CID]._id, //fetch the serverside case ID, to include in further requests
			})
		});
	}

	updateSend = () => {
		const state = this.state
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{state.authFlag=true}); this.render();return}; //redirect to sign-in
		fetch(`http://84.201.129.203:8888/api/cases/${state.SCID}`, {
			method: 'PUT',
			body: JSON.stringify({ 
				"status": state.status,
				"date": state.date,
				"licenseNumber": state.licenseNumber,
				"color": state.color,
				"type": state.type,
				"ownerFullName": state.ownerFullName,
				"officer": state.officer,
				"createdAt": state.createdAt,
				"updateAt": dateFormat(new Date, "isoDate"),
				"clientId": state.clientId,
				"description": state.description,
				"resolution": state.resolution, }),
			headers: {
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`Case #${state.CID}: case file changes applied!`); //possibly redirect
		});
	}

	deleteSend = () => {
		const state = this.state
		if (!localStorage.getItem("token")) {this.setState((prevState)=>{state.authFlag=true}); this.render();return}; //redirect to sign-in

		fetch(`http://84.201.129.203:8888/api/cases/${state.SCID}`, {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer '.concat(localStorage.getItem("token").toString()),
				'Content-type': 'application/json',
			}
		})
		.then(() => { //reset form
			alert(`Case #${state.CID}: case file deleted!`) //redirect
		});
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		const name = event.target.name;

		this.setState((prevState) => { 
			this.state.[name] = value;
			this.forceUpdate();	
		});
	}

	convertStatus(techStatus) {
		if (techStatus === "new") {return "New"}
		else {
			if (techStatus === "in_progress") {return "In progress"}
			else {return "Concluded"};
		};
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

	render() {
		const state = this.state;

		let link = (this.state.authFlag && <Redirect to="/auth"/>) || (<Link to="/cases">Main page</Link>);

		 {/*status: 'new', 						//mandatory; new || in_progress || done
			date: this.getCurrentDate(),		//optional; date of report creation
			licenseNumber: '-840',				//mandatory
			color: 'Unknown',					//mandatory
			type: '',							//optional; (null) || sport || general
			ownerFullName: '',					//mandatory
			officer: '',						//optional; ID of the officer-handler for the case, taken from the database
			createdAt: this.getCurrentDate(),	//mandatory; date of case creation
			updateAt: this.getCurrentDate(),	//mandatory; date of latest case update
			clientId: 'Sizzlefrost',			//mandatory; newfound info is that this is apparently ID for the project, not rly a part of the project itself
			description: '',					//optional
			resolution: '',						//optional; mandatory for closed cases (status: done) */}

		let date = dateFormat(state.date, "isoDate");
		let crd = dateFormat(state.createdAt, "isoDate");
		let upd = dateFormat(state.updateAt, "isoDate");

		return <div className="updateBody">
			<h2>Case file #{state.CID}</h2>
			
			<label htmlFor="status">Status:</label>
			<div className="dropdown">
				<button className="dropbtn"> {this.convertStatus(state.status)} </button>
				<form className={((state.status != "done") && "dropdown-content") || "dropdown-hidden"}>
					<div className="dropdown-single">
						<label htmlFor="new">New</label>
						<input className="dropdown-input" type="radio" name="status" id="new" value="new" onChange={this.handleInputChange} />
					</div>
					<div className="dropdown-single">
						<label htmlFor="in_progress">In progress</label>
						<input className="dropdown-input" type="radio" name="status" id="in_progress" value="in_progress" onChange={this.handleInputChange} />
					</div>
					<div className="dropdown-single">
						<label htmlFor="done">Concluded</label>
						<input className="dropdown-input" type="radio" name="status" id="done" value="done" onChange={this.handleInputChange} />
					</div>
				</form>
			</div> <br />

			<label htmlFor="date">Date of report:</label> 
			<input type="date" name="date" value={date} readOnly={true}/> <br />
				

			<label htmlFor="licenseNumber"> Bike license number: </label>
			<input type="string" name="licenseNumber" placeholder="A12345" onChange={this.handleInputChange} value={state.licenseNumber}/> <br />

			<label htmlFor="status"> Bike colour: </label>
			<input type="text" name="color" placeholder="Blue" onChange={this.handleInputChange} value={state.color}/> <br />

			<label htmlFor="type"> Bike type: </label>
			<div className="dropdown">
				<button className="dropbtn"> {this.interpretValues(state.type)} </button>
				<form className="dropdown-content">
					<div className="dropdown-single">
						<label htmlFor="sport">{this.interpretValues("sport")}</label>
						<input className="dropdown-input" type="radio" name="type" id="sport" value="sport" onChange={this.handleInputChange}/>
					</div>
					<div className="dropdown-single">
						<label htmlFor="general">{this.interpretValues("general")}</label>
						<input className="dropdown-input" type="radio" name="type" id="general" value="general" onChange={this.handleInputChange}/>
					</div>
				</form>
			</div> <br />

			<label htmlFor="ownerFullName"> Full name of bike user: </label>
			<input type="text" name="ownerFullName" placeholder="Adam Barkley" onChange={this.handleInputChange} value={state.ownerFullName}/> <br />

			<label htmlFor="officer"> Case handler: </label>
			<input type="text" name="officer" placeholder="ID of case handler" onChange={this.handleInputChange} value={state.officer}/> <br />

			<label htmlFor="createdAt"> Case creation date: </label>			
			<input type="date" name="createdAt" placeholder="01.01.1970" onChange={this.handleInputChange} value={crd} readOnly={true}/> <br />

			<label htmlFor="updateAt"> Latest case update date: </label>			
			<input type="date" name="updateAt" placeholder="01.01.1970" onChange={this.handleInputChange} value={upd} readOnly={true}/> <br />

			<label htmlFor="description"> Case description: </label>
			<textarea name="description" rows="5" cols="60" maxLength="480" placeholder="Describe the circumstances of the theft and any other useful information" wrap="soft" onChange={this.handleInputChange} value={state.description} /><br />

			<label htmlFor="resolution"> Case resolution comment: </label>
			<textarea name="resolution" rows="5" cols="60" maxLength="480" placeholder="When closing the case, provide a summary of undertaken actions and reasoning for closing the case" wrap="soft" onChange={this.handleInputChange} value={state.resolution} /> <br />

			<input type="button" id="update" value="Update" onClick={this.updateSend}/> <br />
			<input type="button" id="update" value="Delete" onClick={this.deleteSend}/> <br />

			{link}
		</div>
	}
}