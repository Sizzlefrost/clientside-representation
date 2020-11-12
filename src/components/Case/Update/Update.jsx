import React, { Component } from 'react';

import { Link } from 'react-router-dom';

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
					SUID: users[CID]._id, //fetch the serverside user ID, to include in further requests
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
				"updateAt": state.updateAt,
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

		this.setState({ 
			[name]: value	
		});
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

		return <div>
			<h2>Case file #{state.CID}</h2>
			
			<label htmlFor="status">Status:</label>
			{//status: use a dropdown menu
			} <br />

			<label htmlFor="date">Date of report:</label> 
			<input type="date" name="date" value={state.date} disabled={true}/> <br />

			
			
			{link}
		</div>
	}
}