var path    = require('path')
var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var io      = require('socket.io')(http)
var fs      = require('fs')

//endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/register1.html');
});

app.get('/public/css/register.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/register.css');
});

app.use(express.static(__dirname + '/public/assets/website'));

http.listen(3000, () => {
  console.log('server is listening on http://localhost:3000, please connect to this')
});
