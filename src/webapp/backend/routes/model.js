const router = require("express").Router();
const Data = require("./../models/data");
const { spawn } = require("child_process");

// dictionary of all users requesting for prediction
// value true if prediction done, otherwise false
let status = {};

// returns predicted energy value for given time range
router.route("/predict").post(function (req, res) {
  Data.deleteMany({ dataType: "user-" + req.body.username })
    .then((resp) => {
      let token = Date.now().toString();
      status[req.body.username] = [token, false];
      res.status(200).json({ token: token });
      const process = spawn("python3", [
        "./models/model.py",
        req.body.fromDate,
        req.body.fromTime,
        req.body.toDate,
        req.body.toTime,
        req.body.username,
        token,
      ]);
      process.stdout.on("data", (data) => {
        if (
          status[req.body.username] !== undefined &&
          status[req.body.username][0] == token
        ) {
          status[req.body.username][1] = true;
        }
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Gets all the data
router.route("/").get(function (req, res) {
  Data.find(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
});

const str = (val) => {
  if (val < 10) return "0" + val.toString();
  return val;
};

const int = (val) => {
  return parseInt(val);
};

// returns date-temperature dictionary
router.route("/load/temp").post(function (req, res) {
  Data.find({ dataType: "temp" })
    .then((data) => {
      let temp = {};
      for (let i in data) {
        if (data[i].year !== undefined) {
          temp[
            str(data[i].year) +
              "-" +
              str(data[i].month) +
              "-" +
              str(data[i].day) +
              " " +
              str(data[i].hour)
          ] = data[i].value;
        } else {
          temp[str(data[i].hour)] = data[i].value;
        }
      }
      res.status(200).json(temp);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// saves temperature data
router.route("/add/temp").post(function (req, res) {
  const temp = req.body;
  let data = [];
  for (let i in temp) {
    if (i.split(" ").length === 2) {
      const hour = i.split(" ")[1];
      const date = i.split(" ")[0].split("-");
      data.push({
        dataType: "temp",
        year: int(date[0]),
        month: int(date[1]),
        day: int(date[2]),
        hour: int(hour),
        value: temp[i],
      });
    } else {
      data.push({
        dataType: "temp",
        hour: int(i),
        value: temp[i],
      });
    }
  }
  Data.deleteMany({ dataType: "temp" })
    .then((resp) => {
      Data.collection.insertMany(data, function (err, docs) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// returns date - cached predicted energy data dictionary
router.route("/load/predict-data").post(function (req, res) {
  Data.find({ $or: [{ dataType: "act" }, { dataType: "avg" }] })
    .then((data) => {
      let pred = {};
      for (let i in data) {
        if (pred[data[i].dataType] === undefined) {
          pred[data[i].dataType] = {};
        }
        pred[data[i].dataType][
          str(data[i].year) +
            "-" +
            str(data[i].month) +
            "-" +
            str(data[i].day) +
            " " +
            str(data[i].hour)
        ] = data[i].value;
      }
      res.status(200).json(pred);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// caching the predicted energy data
router.route("/add/predict-data").post(function (req, res) {
  const pred = req.body;
  let data = [];
  for (let type in pred) {
    for (let key in pred[type]) {
      let date = key.split(" ")[0];
      date = date.split("-");
      let hour = key.split(" ")[1];
      data.push({
        dataType: type,
        year: int(date[0]),
        month: int(date[1]),
        day: int(date[2]),
        hour: int(hour),
        value: pred[type][key],
      });
    }
  }
  Data.deleteMany({ $or: [{ dataType: "act" }, { dataType: "avg" }] })
    .then((resp) => {
      Data.collection.insertMany(data, function (err, docs) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// returns list of date, predicted daywise energy data to the user
router.route("/load/day-data").post(function (req, res) {
  if (
    status[req.body.username] === undefined ||
    status[req.body.username][0] !== req.body.token
  ) {
    res.status(200).json({ data: [], end: false });
    return;
  }
  Data.find({ dataType: "user-" + req.body.username })
    .then((data) => {
      let pred = [];
      for (let i in data) {
        let date =
          str(data[i].year) + "-" + str(data[i].month) + "-" + str(data[i].day);
        if (pred.length !== 0 && pred[pred.length - 1].date === date) {
          pred[pred.length - 1].yhat += data[i].value;
        } else {
          pred.push({ date: date, yhat: data[i].value });
        }
      }
      res.status(200).json({ data: pred, end: status[req.body.username][1] });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// returns list of date, predicted energy hourwise data to the user
router.route("/load/hour-data").post(function (req, res) {
  if (
    status[req.body.username] === undefined ||
    status[req.body.username][0] !== req.body.token
  ) {
    res.status(200).json({ data: [], end: false });
    return;
  }
  Data.find({ dataType: "user-" + req.body.username })
    .then((data) => {
      let pred = [];
      for (let i in data) {
        pred.push({
          date:
            str(data[i].year) +
            "-" +
            str(data[i].month) +
            "-" +
            str(data[i].day) +
            " " +
            str(data[i].hour),
          yhat: data[i].value,
        });
      }
      res.status(200).json({ data: pred, end: status[req.body.username][1] });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// saves the user's demanded predicted hourwise energy data
router.route("/add/hour-data").post(function (req, res) {
  if (
    status[req.body.username] === undefined ||
    status[req.body.username][0] !== req.body.token
  ) {
    res.status(200).json({ message: "STOP" });
    return;
  }
  const pred = req.body.data;
  const type = "user-" + req.body.username;
  let data = [];
  for (let i in pred) {
    let date = pred[i]["dateTime"].split(" ")[0].split("-");
    let hour = pred[i]["dateTime"].split(" ")[1];
    data.push({
      dataType: type,
      year: int(date[0]),
      month: int(date[1]),
      day: int(date[2]),
      hour: int(hour),
      value: pred[i]["yhat"],
    });
  }
  Data.deleteMany({ dataType: type })
    .then((resp) => {
      Data.collection.insertMany(data, function (err, docs) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
