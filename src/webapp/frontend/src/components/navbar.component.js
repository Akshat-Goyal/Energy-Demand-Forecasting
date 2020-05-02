import React, { Component } from "react";
import { Link } from "react-router-dom";
import ls from "local-storage";
import { Navbar, Nav } from "react-bootstrap";

class UserNavbar extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand
            href={
              "/" + this.props.userType + "/" + this.props.username + "/home"
            }
          >
            Home
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link
              href={
                "/" +
                this.props.userType +
                "/" +
                this.props.username +
                "/predict"
              }
            >
              Prediction
            </Nav.Link>
            <Nav.Link
              href={
                "/" +
                this.props.userType +
                "/" +
                this.props.username +
                "/graphs"
              }
            >
              Graphs
            </Nav.Link>
            <Nav.Link
              href={
                "/" +
                this.props.userType +
                "/" +
                this.props.username +
                "/weather"
              }
            >
              Weather
            </Nav.Link>
            <Nav.Link
              href={
                "/" + this.props.userType + "/" + this.props.username + "/users"
              }
            >
              Users
            </Nav.Link>
            <Nav.Link
              href={
                "/" + this.props.userType + "/" + this.props.username + "/query"
              }
            >
              Customer Care
            </Nav.Link>
            <Nav.Link
              href={
                "/" +
                this.props.userType +
                "/" +
                this.props.username +
                "/profile"
              }
            >
              Profile
            </Nav.Link>
            <Link
              className="nav-link"
              to="/login"
              onClick={(e) => {
                ls.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </Link>
          </Nav>
        </Navbar>
      </React.Fragment>
    );
  }
}

class LoginNavbar extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/home">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar>
      </React.Fragment>
    );
  }
}

export { UserNavbar, LoginNavbar };
