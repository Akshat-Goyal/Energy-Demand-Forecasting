import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
	username: yup
		.string()
		.required("Please Enter a username")
		.min(4, "Too Short!")
		.max(16, "Too Long!"),
	password: yup
		.string()
		.required("Please Enter your password")
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			"Must Contain 8 Characters, One Alphabet, One Number and one special case Character"
		),
});

export default class LoginUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			username: "",
			show: false,
			type: "",
			hidden: true,
		};
	}

	componentDidMount() {
		if (ls.get("username") !== null) {
			window.location.href =
				"/" + ls.get("userType") + "/" + ls.get("username") + "/home";
		}
	}

	componentDidUpdate() {
		if (this.state.redirect === true) {
			window.location.href =
				"/" + this.state.type + "/" + this.state.username + "/home";
		}
	}

	LoginForm = () => {
		return (
			<Formik
				validationSchema={schema}
				initialValues={{
					username: "",
					password: "",
				}}
				onSubmit={(values, actions) => {
					axios
						.post("http://localhost:4000/user/login", values)
						.then((res) => {
							if (res.data !== null) {
								ls.set("username", res.data.username);
								ls.set("userType", res.data.userType);
								this.setState({
									type: res.data.userType,
									username: res.data.username,
									redirect: true,
								});
								console.log(this.state);
							} else {
								actions.setFieldError(
									"general",
									"Username or Password is Incorrect!"
								);
								this.setState({ show: true });
							}
						})
						.catch((err) => {
							actions.setFieldError("general", err.message);
							this.setState({ show: true });
						})
						.finally(() => {
							actions.setSubmitting(false);
						});
				}}
			>
				{({
					handleSubmit,
					handleChange,
					handleBlur,
					values,
					touched,
					isValid,
					errors,
				}) => (
					<Form onSubmit={handleSubmit}>
						{this.state.show && (
							<Form.Group>
								<Alert
									key="general"
									variant={
										errors.general ? "danger" : "light"
									}
									onClose={() =>
										this.setState({ show: false })
									}
									dismissible
								>
									{errors.general}
								</Alert>
							</Form.Group>
						)}

						<Form.Group md="6" controlId="loginUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Username"
								aria-describedby="inputGroupPrepend"
								name="username"
								value={values.username}
								onChange={handleChange}
								isInvalid={
									(touched.username || values.username) &&
									errors.username
								}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.username}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group md="6" controlId="loginPassword">
							<Form.Label>Password</Form.Label>
							<InputGroup>
								<Form.Control
									type={
										this.state.hidden ? "password" : "text"
									}
									securetextentry="true"
									placeholder="Password"
									name="password"
									value={values.password}
									onChange={handleChange}
									isInvalid={
										(touched.password || values.password) &&
										errors.password
									}
								/>
								<InputGroup.Prepend
									onClick={(e) =>
										this.setState({
											hidden: !this.state.hidden,
										})
									}
								>
									<InputGroup.Text id="inputGroupPrepend">
										<i
											className="fa fa-eye"
											style={{
												fontsize: "16px",
												marginRight: "10px",
											}}
										></i>
									</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control.Feedback type="invalid">
									{errors.password}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>

						<Button type="submit">Submit</Button>
					</Form>
				)}
			</Formik>
		);
	};

	render() {
		return (
			<div className="container" style={{ width: "40%" }}>
				<br />
				<h1 className="display-3 jumbotron" align="center">
					Login
				</h1>
				<this.LoginForm />
			</div>
		);
	}
}
