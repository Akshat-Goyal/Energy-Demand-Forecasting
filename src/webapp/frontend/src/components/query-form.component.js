import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  subject: yup.string().required("Please mention the subject"),
  text: yup.string().required("Please tell us about your issue"),
});

export default class QueryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      type: "light",
    };
  }

  componentDidMount() {
    if (
      ls.get("username") !== this.props.match.params.id ||
      ls.get("userType") !== this.props.match.params.type
    ) {
      ls.clear();
      window.location.href = "/login";
    }
  }

  HandleAlert = () => {
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

  View = () => {
    return (
      <Formik
        validationSchema={schema}
        initialValues={{
          subject: "",
          text: "",
        }}
        onSubmit={(values, actions) => {
          this.setState({
            message: "Submitting Form!!",
            type: "warning",
          });
          axios
            .post("http://localhost:4000/user/form", {
              subject: values.subject,
              text: values.text,
              username: this.props.match.params.id,
            })
            .then((res) => {
              this.setState({
                message: "Form submitted successfully!",
                type: "success",
              });
              actions.resetForm();
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
            <Form.Group md="6" controlId="queryTo">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="to-label">To</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" name="to" value="Maintenance Team" />
              </InputGroup>
            </Form.Group>

            <Form.Group md="6" controlId="queryFrom">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="from-label">From</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  name="from"
                  value={this.props.match.params.id}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group md="6" controlId="querySubject">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="subject-label">Issue</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={values.subject}
                  onChange={handleChange}
                  isInvalid={
                    (touched.subject || values.subject) && errors.subject
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.subject}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group md="6" controlId="queryText">
              <Form.Control
                as="textarea"
                name="text"
                rows="15"
                placeholder="Write about your issue"
                value={values.text}
                onChange={handleChange}
                isInvalid={(touched.text || values.text) && errors.text}
              />
              <Form.Control.Feedback type="invalid">
                {errors.text}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit">Submit</Button>
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
          Customer Care
        </h1>
        <this.View />
      </div>
    );
  }
}
