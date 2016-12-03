import "babel-polyfill";
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, Link, IndexRoute, hashHistory} from 'react-router';
import { App } from './components/App';
// const store = createStore(secretSantaApp, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render((
	<Router history={ hashHistory }>
		<Route path="/" component={App} />
	</Router>
), document.getElementById('app'));
