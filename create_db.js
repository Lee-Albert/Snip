var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/snippdb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("snipp db created!");

  var dbo = db.db("snippdb");

  var callback = () => {
    dbo.createCollection('', (err, res) => {
      if (err)
        throw err;
      console.log('shopping cart listing created');
      db.close();
    })
  };

  dbo.createCollection("products", function(err, res) {
    if (err)
      throw err;
    console.log("product collection created!");
    callback();
  });
});
