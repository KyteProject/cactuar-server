import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Application from './containers/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';

render(
	<Router>
		<Application />
	</Router>,
	document.getElementById( 'root' )
);
