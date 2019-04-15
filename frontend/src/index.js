import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import App from 'Containers/App';

const App = () => (
  <Router>
    <Switch>{/* <Route path="/" component={Home} /> */}</Switch>
  </Router>
);

export default ReactDOM.render( <App />, document.getElementById( 'root' ) );
