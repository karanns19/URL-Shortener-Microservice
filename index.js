require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/URL", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => console.log("Database Connected"))

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

app.post('/api/shorturl', function (req, res) {
  const shortUrl = shortid.generate()
  const originalUrl = req.body['url']
  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  })
})

app.get('/api/shorturl/:shortUrl', function (req, res) {
  res.redirect(originalUrl)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

