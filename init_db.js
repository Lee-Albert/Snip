var path        = require('path')
var MongoClient = require('mongodb').MongoClient;
var url         = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
  if (err)
    throw err;
  var fs = require('fs');
  var text = JSON.parse(fs.readFileSync(__dirname + '/databaseinfo.json', 'utf8'));
  var coifs = text.coiffeurs;
  var clients = text.customers;

  var dbo = db.db("snippdb");

  dbo.collection("coif").insertMany(coifs, (err, res) => {
    if (err)
      throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    console.log(res.insertedIds);
    console.log(res.ops);
    console.log(res.result);

    dbo.collection("client").insertMany(clients, (err, res) => {
      if (err)
        throw err;
      console.log("inserted client");
    });
    db.close();
  });
});
