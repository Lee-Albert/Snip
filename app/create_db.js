var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/snippdb";

MongoClient.connect(url, function(err, db) {
  if (err)
    throw err;
  console.log("snipp db created!");

  var dbo = db.db("snippdb");

  var create_requests = () => {
    dbo.createCollection('requests', (err, res) => {
      if (err)
        throw err;
      console.log('requests collection created.');
      db.close();
    });
  }

  var create_coif = () => {
    dbo.createCollection('coif', (err, res) => {
      if (err)
        throw err;
      console.log('coif collection created.');
      create_requests();
    })
  };

  dbo.createCollection("client", (err, res) => {
    if (err)
      throw err;
    console.log('client collection created.');
    create_coif();
  });
});
