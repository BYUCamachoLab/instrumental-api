var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/mongo-test', {
  useNewUrlParser: true
});

const subserverSchema = new mongoose.Schema({
  ee_tag: String,
  name: String,
  description: String,
  ip: String,
  status : {type: Boolean, default: false},
  updated: {type: Date, default: Date.now},
});

subserverSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
subserverSchema.set('toJSON', {
  virtuals: true
});

const Subserver = mongoose.model('Subserver', subserverSchema);

app.get('/api/subservers', async (req, res) => {
  console.log("GET subservers")
  try {
    let subservers = await Subserver.find();
    res.send(subservers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/subservers', async (req, res) => {
  console.log("POST subservers")
    const subserver = new Subserver({
      ee_tag: req.body.ee_tag,
      name: req.body.name,
      description: req.body.description,
      ip: req.body.ip,
    });
  try {
    await subserver.save();
    res.send(subserver);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/subservers/:id', async(req, res) => {
  console.log("DELETE subserver")
  try {
    await Subserver.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/subservers/:id', async(req, res) => {
  console.log("PUT subservers");
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    subserver.name = req.body.name
    subserver.description = req.body.description
    subserver.ip = req.body.ip
    subserver.updated = Date.now()
    await subserver.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.get('/api/subservers/start/:id', async(req, res) => {
  console.log("GET subservers/start");
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    let url = "http://" + subserver.ip + "/start";
    console.log(url);
    let response = await axios.get(url);
    console.log(response.data);
    subserver.status = true;
    await subserver.save()
    res.send(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.get('/api/subservers/stop/:id', async(req, res) => {
  console.log("GET subservers/stop")
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    let url = "http://" + subserver.ip + "/stop";
    console.log(url);
    let response = await axios.get(url);
    console.log(response.data);
    subserver.status = false;
    await subserver.save()
    res.send(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
