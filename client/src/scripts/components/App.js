import React, { Component } from 'react';

export class App extends Component {
	render() {
		return (
			<div className="app">
				<h1>SANTA</h1>
				<button>Add user</button>
				<button>Update user</button>
				{/*{this.props.children}*/}
			</div>
		)
	}
}

