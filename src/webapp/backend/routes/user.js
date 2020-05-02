const router = require("express").Router();
const User = require("./../models/user");
const nodemailer = require("nodemailer");

// add gmail in user and password in pass
// add gmail in line no. 117 in from.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

// Gets all the users
router.route("/").get(function (req, res) {
  User.find(function (err, users) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

// Adds a new user
router.route("/add").post(function (req, res) {
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Login User
router.route("/login").post(function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username, password: password })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// finds user
router.route("/find").post(function (req, res) {
  User.findOne(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// checks if there exists any user with the given key for all keys
router.route("/exist").post(function (req, res) {
  let error = {};
  let cnt = 0;
  for (let key in req.body) {
    let info = {};
    info[key] = req.body[key];
    User.findOne(info)
      .then((user) => {
        if (user !== null) {
          error[key] = user;
        }
        cnt++;
        if (cnt === Object.keys(req.body).length) {
          res.status(200).json(error);
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// sends query form to all the maintainers
router.route("/form").post(function (req, res) {
  User.find({ userType: "Maintenance Team" })
    .then((users) => {
      let to = "";
      for (let i = 0; i < users.length; i++) {
        if (i) {
          to += ", ";
        }
        to += users[i]["email"];
      }
      if (to === "") {
        res.status(400).json({
          message: "Maintenance Team not available!",
        });
        return;
      }
      User.findOne({ username: req.body.username })
        .then((user) => {
          if (user === null) {
            res.status(400).json({
              message: "Username: " + req.body.username + " does not exist!",
            });
            return;
          }
          let text = req.body.text;
          text += "\n\nSend By:";
          text += "\nName: " + user["firstName"] + " " + user["lastName"];
          text += "\nEmail: " + user["email"];
          text += "\nUser Type: " + user["userType"];
          let mailOptions = {
            from: "",
            to: to,
            subject: req.body.subject,
            attachments: [
              {
                filename: "logo.png",
                path: "./images/logo.png",
                cid: "logo",
              },
            ],
            text: text,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
              <meta charset="utf-8" />
              <body>
              <p>
              <img src="cid:logo" width="10%" height="15%" style="border-radius: 50%"/>
              </p>
              <p>
              ${text.replace(new RegExp("\r?\n", "g"), "<br />")}
              </p>
              </body>
              </html>`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.status(400).json({
                message: error.message,
              });
            } else {
              res.status(200).json("Email sent: " + info.response);
            }
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// modify user's info
// req.body.id is the id of the user
// req.body.changes has all the fields to be modified
router.route("/modify").post(function (req, res) {
  User.findByIdAndUpdate(req.body.id, {
    $set: req.body.changes,
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
