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

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(bodyParser.json());
app.use(cors())

app.use('/api/auth/twitter',twitterRoutes);
app.use('/api/poll',pollRoutes);

app.use(errors.createError);
app.use(errors.errorHandler);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT, function() {
  console.log(`Server is starting on port ${process.env.PORT}`);
});

module.exports = app; //for mocha tests.
