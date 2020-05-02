import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { Form, Button, Col, InputGroup, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup
    .string()
    .required("Please Enter your First Name")
    .matches(/^[A-Za-z]+$/, "Please Enter a valid First Name")
    .min(2, "Too Short!")
    .max(32, "Too Long!"),
  lastName: yup
    .string()
    .required("Please Enter your Last Name")
    .matches(/^[A-Za-z]+$/, "Please Enter a valid Last Name")
    .min(2, "Too Short!")
    .max(32, "Too Long!"),
  username: yup
    .string()
    .required("Please Enter a username")
    .matches(/^[^-]*$/, "Sorry, '-' not allowed")
    .min(4, "Too Short!")
    .max(16, "Too Long!"),
  email: yup
    .string()
    .required("Please Enter your Email")
    .matches(
      /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/,
      "Please Enter a valid Email"
    ),
  phoneNo: yup
    .string()
    .required("Please Enter your Phone No.")
    .matches(/^[0-9]{10}$/, "Please Enter a 10 digit Phone Number"),
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Alphabet, One Number and one special case Character"
    ),
  confirmPassword: yup
    .string()
    .required("Please Enter your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  userType: yup.string().required("Please Select the User type"),
});

export default class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      username: "",
      type: "",
      show: false,
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

  RegisterForm = () => {
    return (
      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phoneNo: "",
          password: "",
          confirmPassword: "",
          userType: "Owner",
        }}
        onSubmit={(values, actions) => {
          axios
            .post("http://localhost:4000/user/exist", {
              username: values.username,
              email: values.email,
              phoneNo: values.phoneNo,
            })
            .then((res) => {
              let error = res.data;
              if (Object.keys(error).length === 0) {
                axios
                  .post("http://localhost:4000/user/add", values)
                  .then((res) => {
                    ls.set("username", values.username);
                    ls.set("userType", values.userType);
                    this.setState({
                      redirect: true,
                      type: values.userType,
                      username: values.username,
                    });
                  })
                  .catch((err) => {
                    actions.setFieldError("general", err.message);
                    this.setState({ show: true });
                  });
              } else {
                for (let key in error) {
                  actions.setFieldError(
                    key,
                    "This " + key + " already exists!"
                  );
                }
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
                  variant={errors.general ? "danger" : "light"}
                  onClose={() => this.setState({ show: false })}
                  dismissible
                >
                  {errors.general}
                </Alert>
              </Form.Group>
            )}

            <Form.Row>
              <Form.Group as={Col} md="4" controlId="registerFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isInvalid={
                    (touched.firstName || values.firstName) && errors.firstName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="registerLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={
                    (touched.lastName || values.lastName) && errors.lastName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="registerUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={
                    (touched.username || values.username) && errors.username
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="8" controlId="registerEmail">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={(touched.email || values.email) && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="registerPhoneNo">
                <Form.Label>Phone No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone No."
                  name="phoneNo"
                  value={values.phoneNo}
                  onChange={handleChange}
                  isInvalid={
                    (touched.phoneNo || values.phoneNo) && errors.phoneNo
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="6" controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={this.state.hidden ? "password" : "text"}
                    securetextentry="true"
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={
                      (touched.password || values.password) && errors.password
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

              <Form.Group as={Col} md="6" controlId="registerConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={this.state.hidden ? "password" : "text"}
                    securetextentry="true"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={
                      (touched.confirmPassword || values.confirmPassword) &&
                      errors.confirmPassword
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
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="registerUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                as="select"
                name="userType"
                value={values.userType}
                onChange={handleChange}
              >
                <option>Owner</option>
                <option>Finance Team</option>
                <option>Maintenance Team</option>
              </Form.Control>
            </Form.Group>

            <Button type="submit" name="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  };

  render() {
    return (
      <div className="container">
        <br />
        <h1 className="display-3 jumbotron" align="center">
          Register
        </h1>
        <this.RegisterForm />
      </div>
    );
  }
}
