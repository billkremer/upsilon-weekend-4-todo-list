var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "upsilon_todolist" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);


router.get("/", function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to database", err);
      res.sendStatus(500);
      done(); // returns the connection
    } else {
      // no error occurred, time to query
      client.query( "SELECT * FROM todos ORDER BY task", function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }  // closes client query return function
      );  // closes client query
    }; // closes initial else
  }); // closes pool.connection
}); // closes get


module.exports = router;
