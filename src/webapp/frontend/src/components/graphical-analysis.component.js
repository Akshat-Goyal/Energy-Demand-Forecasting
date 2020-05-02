import React, { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { Form, Button, Alert, InputGroup, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Maps from "fusioncharts/fusioncharts.maps";
import USARegion from "fusionmaps/maps/es/fusioncharts.usaregion";
import ReactFC from "react-fusioncharts";
ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion);

const schema = yup.object({
  fromDate: yup.date().required("Please Enter the Date"),
  fromTime: yup.string().required("Please Enter the Time"),
  toDate: yup.date().required("Please Enter the Date"),
  toTime: yup.string().required("Please Enter the Time"),
});

export default class Graphs extends Component {
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
            message: "Graph Made Successfully!!",
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
    let data = [];
    for (let i = 0; i < this.state.data.length; i++) {
      data.push({
        label: this.state.data[i].date,
        value: this.state.data[i].yhat,
      });
    }
    return (
      <div className="container">
        <this.HandleAlert />
        <br />
        <h1 className="display-3 jumbotron" align="center">
          Graphical Analysis For Predicted Values
        </h1>
        <this.View />
        <br />
        <br />
        {data.length !== 0 && (
          <ReactFC
            {...{
              type: "line",
              width: "100%",
              height: "40%",
              dataFormat: "json",
              dataEmptyMessage: "Loading Data...",
              dataSource: {
                chart: {
                  caption: "Prediced Energy Consumption Data",
                  numberSuffix: "Kw/hr",
                  showValues: "0",
                  exportEnabled: "1",
                  exportFileName: "Predicted Energy Consumption",
                },
                tooltip: {
                  style: {
                    container: {
                      padding: "10px",
                    },
                    tooltext: "Quarter 1{br}Total Sale: $195K{br}Rank: 1",
                    text: {
                      "font-size": "16",
                    },
                    header: {
                      fontColor: "#ff0000",
                    },
                    body: {
                      fontColor: "#ff00ff",
                    },
                  },
                },
                data: data,
              },
            }}
          />
        )}
      </div>
    );
  }
}
