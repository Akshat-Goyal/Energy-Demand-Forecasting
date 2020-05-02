//SideNav.js
import React, { Component } from "react";
import "../css/SideNavbar.css";
import ls from "local-storage";
import logo from "../images/logo.png";

class SideNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			username: "",
			userType: "",
		};
	}

	componentDidMount() {
		if (ls.get("username") === null) {
			this.setState({ loggedIn: false });
		} else {
			this.setState({
				loggedIn: true,
				username: ls.get("username"),
				userType: ls.get("userType"),
			});
		}
	}

	componentDidUpdate() {
		var element = document.getElementById(ls.get("active"));
		if (element != null) {
			element.classList.add("isactive");
		}
	}

	onClick(arg) {
		var element = document.getElementById(ls.get("active"));
		if (element != null) {
			element.classList.remove("isactive");
		}
		ls.set("active", arg);
	}

	render() {
		return (
			<div className="sidenav" align="center">
				<div className="sideContent">
					<img className="logo" src={logo} alt="Organisation"></img>
					{this.state.loggedIn && (
						<React.Fragment>
							<a
								className="isactive"
								style={{ paddingTop: "15%" }}
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/home"
								}
								onClick={(e) => {
									this.onClick(1);
								}}
							>
								<span id={1}>
									<i
										className="fa fa-home"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Home
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/predict"
								}
								onClick={(e) => {
									this.onClick(2);
								}}
							>
								{" "}
								<span id={2}>
									<i
										className="fa fa-bar-chart"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Prediction
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/graphs"
								}
								onClick={(e) => {
									this.onClick(3);
								}}
							>
								{" "}
								<span id={3}>
									<i
										className="fa fa-line-chart"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Graphs
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/weather"
								}
								onClick={(e) => {
									this.onClick(4);
								}}
							>
								{" "}
								<span id={4}>
									<i
										className="fas fa-cloud-sun-rain"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Weather
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/profile"
								}
								onClick={(e) => {
									this.onClick(5);
								}}
							>
								{" "}
								<span id={5}>
									<i
										className="fa fa-user"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Profile
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/users"
								}
								onClick={(e) => {
									this.onClick(6);
								}}
							>
								{" "}
								<span id={6}>
									<i
										className="fa fa-users"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Users
								</span>
							</a>
							<a
								href={
									"/" +
									this.state.userType +
									"/" +
									this.state.username +
									"/query"
								}
								onClick={(e) => {
									this.onClick(7);
								}}
							>
								{" "}
								<span id={7}>
									<i
										className="fa fa-envelope"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Customer Care
								</span>
							</a>
							<a
								href={"/login"}
								onClick={(e) => {
									ls.clear();
									this.onClick(11);
									window.location.href = "/login";
								}}
							>
								{" "}
								<span id={8}>
									<i
										className="fa fa-sign-out"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Logout
								</span>
							</a>
						</React.Fragment>
					)}
					{!this.state.loggedIn && (
						<React.Fragment>
							<a
								style={{ paddingTop: "15%" }}
								href={"/home"}
								onClick={(e) => {
									this.onClick(1);
								}}
							>
								<span id={1}>
									<i
										className="fa fa-home"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>
									Home
								</span>
							</a>
							<a
								href={"/register"}
								onClick={(e) => {
									this.onClick(10);
								}}
							>
								{" "}
								<span id={10}>
									<i
										className="fas fa-user-plus"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>{" "}
									Register
								</span>
							</a>
							<a
								href={"/login"}
								onClick={(e) => {
									this.onClick(11);
								}}
							>
								{" "}
								<span id={11}>
									<i
										className="fa fa-sign-in"
										style={{
											fontsize: "16px",
											marginRight: "10px",
										}}
									></i>{" "}
									Login
								</span>
							</a>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}
export { SideNavbar };
