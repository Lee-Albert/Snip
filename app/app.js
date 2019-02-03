var path    = require('path')
var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var io      = require('socket.io')(http)
var fs      = require('fs')
var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;


//endpoints
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/register.html');
});

app.get('/public/html/coif.html', (req, res) => {
  res.sendFile(__dirname + '/public/html/coif.html');
});

app.get('/public/html/client.html', (req, res) => {
  res.sendFile(__dirname + '/public/html/client.html');
});

//routing css
app.get('/public/css/register.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/register.css');
});

app.get('/public/css/coif.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/coif.css');
});

app.get('/public/css/client.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/client.css');
});

app.use(express.static(__dirname + '/public/assets/website'));

//api

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// ===============================================================
// print the in coifs
app.get('/api/get-coif', (req, res) => {
  console.log('getting coifs');

  MongoClient.connect(url, (err, db) => {
    if (err)
      throw err;
    var dbo = db.db('snippdb');

    dbo.collection('coif').find({}, {projection: { _id : 0 }}).toArray((err, result) => {
      if (err)
        throw err;
      if (result.length != 0) {
        console.log('found all');
        res.status(200).json(result);
      }
      else {
        console.log('no coifs');
        res.status(400).json( { error:"no coifs found" } );
      }
      db.close();
    });
  });
});

app.get('/api/get-client', (req, res) => {
  console.log('getting clients');

  MongoClient.connect(url, (err, db) => {
    if (err)
      throw err;
    var dbo = db.db('snippdb');

    dbo.collection('client').find({}, {projection: { _id : 0 }}).toArray((err, result) => {
      if (err)
        throw err;
      if (result.length != 0) {
        console.log('found all');
        res.status(200).json(result);
      }
      else {
        console.log('no clients');
        res.status(400).json( { error:"no clients found" } );
      }
      db.close();
    });
  });
});

// =========================== POST ============================================

app.post('/api/coif-login', (req, res) => {
  console.log('new coif login');
  console.log('coif name: ' + req.body.name);
  console.log('coif email: ' + req.body.email);

  MongoClient.connect(url, (err, db) => {
    if (err)
      return err;
    var dbo = db.db('snippdb');
    var new_coif = {
      name  : req.body.name,
      email : req.body.email
    };
    dbo.collection('coif').insertOne(new_coif, (err, result) => {
      if (err) {
        res.status(400).json({ error:"error something oops" });
        throw err;
      }
      console.log("added coif success");

      //redirect
      res.redirect('/public/html/coif.html');
      db.close();
    });
  });
});

app.post('/api/client-login', (req, res) => {
  console.log('new client login');
  console.log('client name: ' + req.body.name);
  console.log('client email: ' + req.body.email);

  MongoClient.connect(url, (err, db) => {
    if (err)
      return err;
    var dbo = db.db('snippdb');
    var new_client = {
      name  : req.body.name,
      email : req.body.email
    };
    dbo.collection('client').insertOne(new_client, (err, result) => {
      if (err) {
        res.status(400).json({ error:"error something oops" });
        throw err;
      }
      console.log("added client success");

      //redirect
      res.redirect('/public/html/client.html');
      db.close();
    });
  });
});

// SOCKETIO

io.on('connection', (client) => {
  client.on('grab_list', (type) => {
    if (type == 'client') {
      MongoClient.connect(url, (err, db) => {
        if (err)
          throw err;
        var dbo = db.db('snippdb');

        dbo.collection('client').find({}, {projection: { _id : 0 }}).toArray((err, result) => {
          if (err)
            throw err;
          if (result.length != 0) {
            console.log('found all clients'); //success!!!
            client.emit('fetch_list', result);
          }
          else {
            console.log('no clients in db');
          }
          db.close();
        });
      });
    }
    else if (type == 'coif') {
      MongoClient.connect(url, (err, db) => {
        if (err)
          throw err;
        var dbo = db.db('snippdb');

        dbo.collection('coif').find({}, {projection: { _id : 0 }}).toArray((err, result) => {
          if (err)
            throw err;
          if (result.length != 0) {
            console.log('found all clients'); //success!!!
            client.emit('fetch_list', result);
          }
          else {
            console.log('no clients in db');
          }
          db.close();
        });
      });
    }
  });
});

http.listen(3000, () => {
  console.log('server is listening on http://localhost:3000, please connect to this')
});
