require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/URL", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected!");
});

//Schema n Model
var urlSchema = new mongoose.Schema({
  id: Number,
  url: String
});

var urlModel = mongoose.model("url", urlSchema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", function(req, res) {
  let urlRegex = /https:\/\/www.|http:\/\/www./g;
  
  dns.lookup(req.body.url.replace(urlRegex, ""), (err, address, family) => {
    if (err) {
      res.json({"error":"invalid URL"});
    } else {
      urlModel
        .find()
        .exec()
        .then(data => {
          new urlModel({
            id: data.length + 1,
            url: req.body.url
          })
            .save()
            .then(() => {
              res.json({
                original_url: req.body.url,
                short_url: data.length + 1
              });
            })
            .catch(err => {
              res.json(err);
            });
        });
    }
  });
});

//get
app.get("/api/shorturl/:number", function(req, res) {
  urlModel
    .find({ id: req.params.number })
    .exec()
    .then(url => {
      res.redirect(url[0]["url"]);
    });
});

app.get('/api/shorturl/:shortUrl', function (req, res) {
  res.redirect(originalUrl)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

