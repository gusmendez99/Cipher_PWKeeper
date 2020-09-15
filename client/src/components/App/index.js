import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import Home from "../../pages/Home";
import Login from "../../pages/Login";

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Login />
				</Route>
				<Route path="/home">
					<Home />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
