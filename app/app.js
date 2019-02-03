var path    = require('path')
var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var io      = require('socket.io')(http)
var fs      = require('fs')

//endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/register.html');
});

//routing
app.get('/public/css/register.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/register.css');
});

app.use(express.static(__dirname + '/public/assets/website'));

//api

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.post('/api/coif-login', (req, res) => {
  console.log('COIF TRIED TO LOGIN');
  console.log('coif name: ' + req.body.name);
  console.log('coif email: ' + req.body.email);
});

app.post('/api/client-login', (req, res) => {
  console.log('CLIENT TRIED TO LOGIN');
});

http.listen(3000, () => {
  console.log('server is listening on http://localhost:3000, please connect to this')
});
