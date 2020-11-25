import React, { Component } from 'react';
import './Frontpage.css';

export class FrontPageComponent extends Component {
	render() {
		return <div className="mainBody">
			<h1>Simple. Special. Secure.</h1> <br />
			<p>
				BikeSecure is a reliable bicycle theft report handling service.
			</p>
		</div>
	}
}