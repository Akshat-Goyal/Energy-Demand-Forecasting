const { spawn } = require("child_process");
const User = require("./user");
const Data = require("./data");
const nodemailer = require("nodemailer");

// add gmail in user and password in pass
// add gmail in line no. 57 in from.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

// sends notification to all the users
const notify = () => {
  let token = Date.now();
  let date = new Date(token);
  date =
    date.getFullYear().toString() +
    "-" +
    date.getMonth().toString() +
    "-" +
    date.getDate().toString();
  try {
    const process = spawn("python3", [
      "./models/model.py",
      date,
      "00:00",
      date,
      "23:59",
      "prediction-team",
      token.toString(),
    ]);
    process.stdout.on("data", (data) => {
      User.find({ notification: true })
        .then((users) => {
          Data.find({ dataType: "user-" + "prediction-team" })
            .then((data) => {
              let total = 0;
              for (let i in data) {
                total += data[i].value;
              }
              total = Math.round(total * 100) / 100;
              let to = "";
              for (let i = 0; i < users.length; i++) {
                if (i) {
                  to += ", ";
                }
                to += users[i]["email"];
              }
              if (to === "") {
                return "No user interested in notification!!";
              }
              let mailOptions = {
                from: "",
                to: to,
                subject: "today's expected energy consumption",
                text:
                  "Dear User,\n Today's energy consumption is expected to be about " +
                  total.toString() +
                  "\n\nThank You\nEnergy Prediction Team\n",
                attachments: [
                  {
                    filename: "logo.png",
                    path: "./images/logo.png",
                    cid: "logo",
                  },
                ],
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
                    Dear User,
                    </p>
                    <p>
                    Today's energy consumption is expected to be about ${total.toString()} kWh.
                    </p>
                    <br />
                    <p>
                    Thank You
                    </p>
                    <p>
                    Energy Prediction Team
                    </p>
                    </body>
                    </html>`,
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return error.message;
                } else {
                  return info.response;
                }
              });
            })
            .catch((err) => {
              return err.message;
            });
        })
        .catch((err) => {
          return err.message;
        });
    });
  } catch (err) {
    return err.message;
  }
};

// cleans old data
const clean_data = () => {
  let date = new Date(Date.now());
  date = new Date(date.setMonth(date.getMonth() - 2));
  let month = date.getMonth();
  let year = date.getFullYear();
  Data.deleteMany({
    $or: [{ dataType: "act" }, { dataType: "avg" }, { dataType: "temp" }],
    $or: [
      { $and: [{ year: year }, { month: { $lte: month } }] },
      { $and: [{ year: { $lt: year } }] },
    ],
  })
    .then((resp) => {
      return resp.message;
    })
    .catch((err) => {
      return err.message;
    });
};

// send notification at a fixed time
const cron = require("node-cron");
const task = cron.schedule("0 0 8 * * *", () => {
  notify();
  clean_data();
});

module.exports = task;
