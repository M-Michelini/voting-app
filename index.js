require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const path = require("path")

const errors = require("./helpers/error");

const twitterRoutes = require('./routes/twitter');
const pollRoutes = require('./routes/poll');

const app = express();

mongoose.connect(process.env.MONGO_URI,{
  reconnectTries: Number.MAX_VALUE,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  keepAlive:true
});
<<<<<<< HEAD
if(process.env.NODE_ENV!=="development"){
=======
if(process.env.NODE_ENV!=="dev"){
>>>>>>> 43d9f23925428f8181c3748d4f4505394d7e6473
  app.use(express.static(path.join(__dirname, "client", "build")))
}
app.use(bodyParser.json());
app.use(cors())

app.use('/api/auth/twitter',twitterRoutes);
app.use('/api/poll',pollRoutes);

app.use(errors.createError);
app.use(errors.errorHandler);

<<<<<<< HEAD
if(process.env.NODE_ENV!=="development"){
=======
if(process.env.NODE_ENV!=="dev"){
>>>>>>> 43d9f23925428f8181c3748d4f4505394d7e6473
  app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, function() {
  console.log(`Server is starting on port ${PORT}`);
});

module.exports = app; //for mocha tests.
