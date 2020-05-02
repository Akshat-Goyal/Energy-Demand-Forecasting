import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import RegisterUser from "./components/register-user.component";
import LoginUser from "./components/login-user.component";
import Predict from "./components/predict-energy.component";
import Graphs from "./components/graphical-analysis.component";
import Users from "./components/users-list.component";
import QueryForm from "./components/query-form.component";
import Profile from "./components/profile-user.component";
import Weather from "./components/view-weather.component";
import Dashboard from "./components/Dashboard.component";
import { SideNavbar } from "./components/SideNavbar.component";

function App() {
	return (
		<Router>
			<div className="row" style={{ height: "100%", width: "100%" }}>
				<div className="col-md-2" style={{ padding: "0" }}>
					<SideNavbar></SideNavbar>
				</div>
				<div className="col-md-10" style={{ padding: "0" }}>
					<Route path="/" exact component={Dashboard} />
					<Route path="/home" component={Dashboard} />
					<Route path="/:type/:id/home" component={Dashboard} />
					<div>
						<Route path="/register" component={RegisterUser} />
						<Route path="/login" component={LoginUser} />
						<Route path="/:type/:id/predict" component={Predict} />
						<Route path="/:type/:id/graphs" component={Graphs} />
						<Route path="/:type/:id/users" component={Users} />
						<Route path="/:type/:id/query" component={QueryForm} />
						<Route path="/:type/:id/profile" component={Profile} />
						<Route path="/:type/:id/weather" component={Weather} />
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
