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
  userType: yup.string().required("Please Select the User type"),
  notification: yup.bool().required(),
});

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      isChanged: false,
      message: "",
      type: "light",
      hidden: true,
    };
  }

  fetchInfo = () => {
    axios
      .post("http://localhost:4000/user/find", {
        username: this.props.match.params.id,
      })
      .then((response) => {
        this.setState({
          user: response.data,
          message: "",
          type: "light",
        });
      })
      .catch((err) => {
        this.setState({
          user: {},
          message: err.message,
          type: "danger",
        });
      });
  };

  componentDidMount() {
    if (
      ls.get("username") !== this.props.match.params.id ||
      ls.get("userType") !== this.props.match.params.type
    ) {
      ls.clear();
      window.location.href = "/login";
    }
    this.fetchInfo();
  }

  HandleAlert = () => {
    setTimeout(() => {
      this.setState({ message: "", type: "light" });
    }, 10000);
    return (
      <React.Fragment>
        {this.state.message !== "" && (
          <React.Fragment>
            <br />
            <Alert
              key="general"
              variant={this.state.type}
              onClose={() => this.setState({ message: "", type: "light" })}
              dismissible
            >
              {this.state.message}
            </Alert>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  InitializeValues = (values) => {
    this.setState({ isChanged: true });
    values.firstName = this.state.user.firstName;
    values.lastName = this.state.user.lastName;
    values.email = this.state.user.email;
    values.phoneNo = this.state.user.phoneNo;
    values.password = this.state.user.password;
    values.userType = this.state.user.userType;
    values.notification = this.state.user.notification;
    return values;
  };

  View = () => {
    return (
      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: this.state.user !== {} ? this.state.user.firstName : "",
          lastName: this.state.user !== {} ? this.state.user.lastName : "",
          email: this.state.user !== {} ? this.state.user.email : "",
          phoneNo: this.state.user !== {} ? this.state.user.phoneNo : "",
          password: this.state.user !== {} ? this.state.user.password : "",
          userType: this.state.user !== {} ? this.state.user.userType : "Owner",
        }}
        onSubmit={(values, actions) => {
          axios
            .post("http://localhost:4000/user/exist", {
              email: values.email,
              phoneNo: values.phoneNo,
            })
            .then((res) => {
              let error = res.data;
              let mod = 1;
              for (let key in error) {
                if (error[key]._id !== this.state.user._id) {
                  mod = 0;
                  break;
                }
              }
              if (mod === 1) {
                axios
                  .post("http://localhost:4000/user/modify", {
                    id: this.state.user._id,
                    changes: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      phoneNo: values.phoneNo,
                      password: values.password,
                      userType: values.userType,
                      notification: values.notification,
                    },
                  })
                  .then((user) => {
                    this.setState({
                      message: "Profile updated successfully!!",
                      type: "success",
                      user: user.data,
                      isChanged: false,
                      hidden: true,
                    });
                  })
                  .catch((err) => {
                    this.setState({
                      message: err.message,
                      type: "danger",
                    });
                  });
              } else {
                for (let key in error) {
                  if (error[key]._id !== this.state.user._id) {
                    actions.setFieldError(
                      key,
                      "This " + key + " already exists!"
                    );
                  }
                }
              }
            })
            .catch((err) => {
              this.setState({
                message: err.message,
                type: "danger",
              });
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
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="profileFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  defaultValue={
                    this.state.user !== {} ? this.state.user.firstName : ""
                  }
                  onChange={(e) => {
                    if (!this.state.isChanged) {
                      values = this.InitializeValues(values);
                    }
                    handleChange(e);
                  }}
                  isInvalid={
                    (touched.firstName || values.firstName) &&
                    errors.firstName &&
                    this.state.isChanged
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="profileLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  defaultValue={
                    this.state.user !== {} ? this.state.user.lastName : ""
                  }
                  onChange={(e) => {
                    if (!this.state.isChanged) {
                      values = this.InitializeValues(values);
                    }
                    handleChange(e);
                  }}
                  isInvalid={
                    (touched.lastName || values.lastName) &&
                    errors.lastName &&
                    this.state.isChanged
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="profileUsername">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={this.state.user !== {} ? this.state.user.username : ""}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="8" controlId="profileEmail">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    name="email"
                    defaultValue={
                      this.state.user !== {} ? this.state.user.email : ""
                    }
                    onChange={(e) => {
                      if (!this.state.isChanged) {
                        values = this.InitializeValues(values);
                      }
                      handleChange(e);
                    }}
                    isInvalid={
                      (touched.email || values.email) &&
                      errors.email &&
                      this.state.isChanged
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="profilePhoneNo">
                <Form.Label>Phone No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone No."
                  name="phoneNo"
                  defaultValue={
                    this.state.user !== {} ? this.state.user.phoneNo : ""
                  }
                  onChange={(e) => {
                    if (!this.state.isChanged) {
                      values = this.InitializeValues(values);
                    }
                    handleChange(e);
                  }}
                  isInvalid={
                    (touched.phoneNo || values.phoneNo) &&
                    errors.phoneNo &&
                    this.state.isChanged
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="6" controlId="profileUserType">
                <Form.Label>User Type</Form.Label>
                <Form.Control
                  as="select"
                  name="userType"
                  onChange={(e) => {
                    if (!this.state.isChanged) {
                      values = this.InitializeValues(values);
                    }
                    handleChange(e);
                  }}
                >
                  <option
                    selected={
                      this.state.user.userType === "Owner" ? true : false
                    }
                  >
                    Owner
                  </option>
                  <option
                    selected={
                      this.state.user.userType === "Finance Team" ? true : false
                    }
                  >
                    Finance Team
                  </option>
                  <option
                    selected={
                      this.state.user.userType === "Maintenance Team"
                        ? true
                        : false
                    }
                  >
                    Maintenance Team
                  </option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="profilePassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={this.state.hidden ? "password" : "text"}
                    securetextentry="true"
                    placeholder="Password"
                    name="password"
                    defaultValue={
                      this.state.user !== {} ? this.state.user.password : ""
                    }
                    onChange={(e) => {
                      if (!this.state.isChanged) {
                        values = this.InitializeValues(values);
                      }
                      handleChange(e);
                    }}
                    isInvalid={
                      (touched.password || values.password) &&
                      errors.password &&
                      this.state.isChanged
                    }
                  />
                  <InputGroup.Prepend
                    onClick={(e) =>
                      this.setState({ hidden: !this.state.hidden })
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
            </Form.Row>

            <Form.Row>
              <Form.Group controlId="profileNotification">
                <Form.Check
                  defaultChecked={this.state.user.notification}
                  name="notification"
                  label="Do you wish to receive the notifications"
                  onChange={(e) => {
                    if (!this.state.isChanged) {
                      values = this.InitializeValues(values);
                    }
                    handleChange(e);
                  }}
                />
              </Form.Group>
            </Form.Row>

            {!this.state.isChanged && (
              <Button variant={"light"}> Save Changes </Button>
            )}

            {this.state.isChanged && (
              <Button type="submit" name="submit">
                Save Changes
              </Button>
            )}
          </Form>
        )}
      </Formik>
    );
  };

  render() {
    return (
      <div className="container">
        <this.HandleAlert />
        <br />
        <h1 className="display-3 jumbotron" align="center">
          My Profile
        </h1>
        <this.View />
      </div>
    );
  }
}
