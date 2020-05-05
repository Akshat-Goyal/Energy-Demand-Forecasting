# Energy Demand Forecasting App

## About

- MERN based web application developed for the companies to manage their energy consumption.

- predicts the future energy consumption of the commercial complex by using Machine Learning - Facebook's Prophet model

## Features

- login / register as owner, finance team, maintenance team.

- dashboard showing the analysis of live and real data of the energy consumption of the complex.

- predicts the future energy consumption of the complex.

- graphical analysis of predicted energy consumption.

- download option for the predicted values and graphs.

- shows the 5 day future weather prediction.

- caching of the predicted data for fast queries.

- customer care feature to ask queries from the maintenance team.

- notification feature which emails users daily about the excepted today's energy consumption and other stats.

- profile update feature

- view users' list feature

## Demo Video Link

https://drive.google.com/file/d/1yFW5-8xb1EmC573gx1mfL2XV0RDNAtEk/view?usp=sharing

## Requirements:

- Python3
- Nodejs
- Reactjs
- Expressjs
- MongoDb

## Running the program

### Python

- pip3 install fbprophet
- pip3 install pickle
- pip3 install matplotlib==3.2.1

### Node

- sudo apt-get update
- sudo apt-get install nodejs
- sudo apt-get install npm

### MongoDB

- sudo apt install -y mongodb

### React

- npm install -g create-react-app

### Express

- npm i express

## Running the code

- Run Express:

```
cd backend/
npm install
npm start
```

- Run React:

```
cd fronted/
npm install/
npm start
```

- Add email id in backend/routes/user.js and backend/models/task.js to use feedback and notification features.

- Add your open weather api key and city id in the frontend/src/components/view-weather.component.js to use weather feature.

- Add your apikey and spreadsheetid in frontend/src/config.js to see live data on dashboard. Check frontend/src/components/dashboard-sheet.csv for data format.

---
