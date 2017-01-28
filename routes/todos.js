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
      // 1. sql string - the actual SQL query we want to running
      // 2. array of data - any data we want to pass to a parameterized statement
      // 3. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query(
        "SELECT * FROM todos ORDER BY task",
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});
