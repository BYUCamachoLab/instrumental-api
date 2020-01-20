var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

// connect to the database
mongoose.connect('mongodb://mongo:27017/serverdb', {
  useNewUrlParser: true
});

const subserverSchema = new mongoose.Schema({
  ee_tag: String,
  name: String,
  description: String,
  ip: String,
  port: String,
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

router.get('/subservers', async (req, res) => {
  console.log("GET subservers")
  try {
    let subservers = await Subserver.find();
    res.send(subservers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/subservers', async (req, res) => {
  console.log("POST subservers")
    const subserver = new Subserver({
      ee_tag: req.body.ee_tag,
      name: req.body.name,
      description: req.body.description,
      ip: req.body.ip,
      port: req.body.port,
    });
  try {
    await subserver.save();
    res.send(subserver);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/subservers/:id', async(req, res) => {
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

router.put('/subservers/:id', async(req, res) => {
  console.log("PUT subservers");
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    subserver.name = req.body.name
    subserver.description = req.body.description
    subserver.ip = req.body.ip
    subserver.port = req.body.port
    subserver.updated = Date.now()
    await subserver.save();
    res.send(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

router.get('/subservers/start/:id', async(req, res) => {
  console.log("GET subservers/start");
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    let url = "http://" + subserver.ip + ":" + subserver.port + "/start";
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

router.get('/subservers/stop/:id', async(req, res) => {
  console.log("GET subservers/stop")
  try {
    console.log(req.params);
    let subserver = await Subserver.findOne({
      _id: req.params.id
    });
    let url = "http://" + subserver.ip + ":" + subserver.port + "/stop";
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

module.exports = router;
