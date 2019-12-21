var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
  name: String,
  description: String,
  port: Number,
  updated: Date,
});

candidateSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
// candidateSchema.set('toJSON', {
//   virtuals: true
// });

// const Candidate = mongoose.model('Candidate', candidateSchema);

// app.get('/api/candidates', async (req, res) => {
//   console.log("GET candidates")
//   try {
//     let candidates = await Candidate.find();
//     res.send(candidates);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.post('/api/candidates', async (req, res) => {
//   console.log("POST candidates")
//     const candidate = new Candidate({
//     name: req.body.name,
//     bio: req.body.bio,
//   });
//   try {
//     await candidate.save();
//     res.send(candidate);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.delete('/api/candidates/:id', async(req, res) => {
//   console.log("DELETE candidates")
//   try {
//     await Candidate.deleteOne({
//       _id: req.params.id
//     });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.put('/api/candidates/:id', async(req, res) => {
//   console.log("PUT candidates");
//   try {
//     console.log(req.params);
//     let candidate = await Candidate.findOne({
//       _id: req.params.id
//     });
//     candidate.votes += 1;
//     await candidate.save();
//     res.send(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// })



module.exports = app;
