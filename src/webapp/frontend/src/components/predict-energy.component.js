import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { Form, Button, Alert, InputGroup, Table, Col } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  fromDate: yup.date().required("Please Enter the Date"),
  fromTime: yup.string().required("Please Enter the Time"),
  toDate: yup.date().required("Please Enter the Date"),
  toTime: yup.string().required("Please Enter the Time"),
});

const headers = [
  { label: "DateTime", key: "date" },
  { label: "Energy (kWh)", key: "yhat" },
];

export default class Predict extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      type: "light",
      interval: null,
      data: [],
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

  Download = () => {
    return (
      <div>
        {this.state.type === "success" && (
          <CSVLink
            data={this.state.data}
            headers={headers}
            filename={"data.csv"}
            className="btn btn-primary"
            target="_blank"
          >
            Download
          </CSVLink>
        )}
      </div>
    );
  };

  hourToDay = (data) => {
    if (data.length === 0) {
      return [];
    }
    let arr = [];
    let date = data[0].date.split(" ")[0];
    let val = data[0].yhat;
    for (let i = 1; i < data.length; i++) {
      if (data[i].date.split(" ")[0] === date) {
        val += data[i].yhat;
      } else {
        val = Math.round(val * 100) / 100;
        arr.push({ date: date, yhat: val });
        date = data[i].date.split(" ")[0];
        val = data[i].yhat;
      }
    }
    arr.push({ date: date, yhat: Math.round(val * 100) / 100 });
    return arr;
  };

  Data = () => {
    let table = [];
    let body = [];
    let row = [];
    row.push(<th key="date">{"Date"}</th>);
    row.push(<th key="energy">{"Energy (kWh)"}</th>);
    body.push(<tr key={0}>{row}</tr>);
    table.push(<thead key="head">{body}</thead>);
    body = [];
    let data = this.hourToDay(this.state.data);
    let total = 0;
    for (let i in data) {
      row = [];
      let val = data[i]["yhat"];
      val = Math.round(val * 100) / 100;
      total += val;
      row.push(<td key={"date" + i}>{data[i]["date"]}</td>);
      row.push(<td key={"energy" + i}>{val}</td>);
      body.push(<tr key={i}>{row}</tr>);
    }
    row = [];
    total = Math.round(total * 100) / 100;
    row.push(<td key={"ttotal"}>{"Total"}</td>);
    row.push(<td key={"tenergy"}>{total}</td>);
    body.push(<tr key={"tbody"}>{row}</tr>);
    table.push(<tbody key="body">{body}</tbody>);
    return (
      <Table striped bordered hover variant="light">
        {this.state.data.length !== 0 && table}
      </Table>
    );
  };

  fetchData = (token) => {
    axios
      .post("http://localhost:4000/model/load/hour-data", {
        username: this.props.match.params.id,
        token: token,
      })
      .then((res) => {
        let data = res.data.data;
        if (res.data.end === true) {
          clearInterval(this.state.interval);
          this.setState({
            message: "Energy Prediction Completed Successfully!",
            type: "success",
            interval: null,
            data: data,
          });
        } else {
          this.setState({ data: data });
        }
      })
      .catch((err) => {
        clearInterval(this.state.interval);
        this.setState({
          message: err.message,
          type: "danger",
          interval: null,
        });
      });
  };

  View = () => {
    return (
      <Formik
        validationSchema={schema}
        initialValues={{
          fromDate: "",
          fromTime: "",
          toDate: "",
          toTime: "",
        }}
        onSubmit={(values, actions) => {
          if (values.fromDate.localeCompare(values.toDate) > 0) {
            actions.setFieldError("toDate", "Invalid Date!");
            actions.setSubmitting(false);
          } else if (
            values.fromDate.localeCompare(values.toDate) === 0 &&
            values.fromTime.localeCompare(values.toTime) >= 0
          ) {
            actions.setFieldError("toTime", "Invalid Time!");
            actions.setSubmitting(false);
          } else {
            if (this.state.interval != null) {
              clearInterval(this.state.interval);
            }
            this.setState({
              message: "Please wait for some time!!",
              type: "warning",
              interval: null,
              data: [],
            });
            axios
              .post("http://localhost:4000/model/predict", {
                fromDate: values.fromDate,
                fromTime: values.fromTime,
                toDate: values.toDate,
                toTime: values.toTime,
                username: this.props.match.params.id,
              })
              .then((res) => {
                let interval = setInterval(() => {
                  this.fetchData(res.data.token);
                }, 6000);
                this.setState({ interval: interval });
              })
              .catch((err) => {
                if (this.state.interval != null) {
                  clearInterval(this.state.interval);
                }
                this.setState({
                  message: err.message,
                  type: "danger",
                  interval: null,
                });
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }
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
              <Form.Group as={Col} md="6" controlId="predictFrom">
                <Form.Label>From</Form.Label>
                <Form.Group md="6" controlId="predictFromDate">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fromDate">Date</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      aria-describedby="fromDate"
                      name="fromDate"
                      value={values.fromDate}
                      onChange={handleChange}
                      isInvalid={
                        (touched.fromDate || values.fromDate) && errors.fromDate
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fromDate}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group md="6" controlId="predictFromTime">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fromTime">Time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="time"
                      placeholder="Time"
                      name="fromTime"
                      value={values.fromTime}
                      onChange={handleChange}
                      isInvalid={
                        (touched.fromTime || values.fromTime) && errors.fromTime
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fromTime}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="predictTo">
                <Form.Label>To</Form.Label>
                <Form.Group md="6" controlId="predictToDate">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="toDate">Date</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      aria-describedby="toDate"
                      name="toDate"
                      value={values.toDate}
                      onChange={handleChange}
                      isInvalid={
                        (touched.toDate || values.toDate) && errors.toDate
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.toDate}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group md="6" controlId="predictToTime">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="toTime">Time</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="time"
                      placeholder="Time"
                      name="toTime"
                      value={values.toTime}
                      onChange={handleChange}
                      isInvalid={
                        (touched.toTime || values.toTime) && errors.toTime
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.toTime}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form.Group>
            </Form.Row>

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
          Predict Energy Consumption
        </h1>
        <this.View />
        <br />
        <br />
        <this.Data />
        <br />
        <this.Download />
      </div>
    );
  }
}
