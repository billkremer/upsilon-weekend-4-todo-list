var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "upsilon_todolist" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);

var verbose = true; // lets messages be turned off for non-error console.logs


router.put('/update/:id', function (req, res) {
  if (verbose) console.log(req.body, 'req.body PUT', req.params);

  var tempdate = new Date().toISOString();
  if (req.body.task_due == "") {
    req.body.task_due = tempdate;
  };

  if (req.body.task == "") {
    req.body.task = "New Task: " + tempdate.substring(0,10);
  };

  pool.connect (function (err, client, done) { // done is the function we run after it is done.
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query( 'UPDATE todos SET task=$2, task_due=$3, task_priority=$4  WHERE id = $1 RETURNING *',  [req.params.id, req.body.title, req.body.task_due, req.body.task_priority], function (err, result) {
        done(); // gives the connection back to the db
        if (err) {
          console.log('error querying DB', err);
          res.sendStatus(500);
        } else {
          if (verbose) console.log('updated', result);
          res.send(result.rows);
        };
      }); // closes client query
    }; // closes initial else
  }); // closes pool.connection
});


router.put('/complete/:id', function (req, res) {
  if (verbose) console.log(req.body, 'req.body PUT complete', req.params);

  var tempdate = new Date().toISOString();
  if (req.body.task_due == "") {
    req.body.task_due = tempdate;
  };
console.log(tempdate,'date');
  if (req.body.task == "") {
    req.body.task = "New Task: " + tempdate.substring(0,10);
  };

  req.body.task_completed = tempdate;

  pool.connect (function (err, client, done) { // done is the function we run after it is done.
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query( 'UPDATE todos SET task=$2, task_due=$3, task_priority=$4, task_completed=$5 WHERE id = $1 RETURNING *',  [req.params.id, req.body.title, req.body.task_due, req.body.task_priority, req.body.task_completed], function (err, result) {
        done(); // gives the connection back to the db
        if (err) {
          console.log('error querying DB', err);
          res.sendStatus(500);
        } else {
          if (verbose) console.log('updated', result);
          res.send(result.rows);
        };
      }); // closes client query
    }; // closes initial else
  }); // closes pool.connection
});



router.put('/uncomplete/:id', function (req, res) {
  if (verbose) console.log(req.body, 'req.body PUT complete', req.params);

  var tempdate = new Date().toISOString();
  if (req.body.task_due == "") {
    req.body.task_due = tempdate;
  };
console.log(tempdate,'date');
  if (req.body.task == "") {
    req.body.task = "New Task: " + tempdate.substring(0,10);
  };

  req.body.task_completed = null;

  pool.connect (function (err, client, done) { // done is the function we run after it is done.
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query( 'UPDATE todos SET task_completed=$2 WHERE id = $1 RETURNING *',  [req.params.id, req.body.task_completed], function (err, result) {
        done(); // gives the connection back to the db
        if (err) {
          console.log('error querying DB', err);
          res.sendStatus(500);
        } else {
          if (verbose) console.log('updated', result);
          res.send(result.rows);
        };
      }); // closes client query
    }; // closes initial else
  }); // closes pool.connection
});



router.post("/", function(req, res) { // adding new todos
if (verbose) console.log(req.body, 'req.body POST');

    var tempdate = new Date().toISOString();
  if (req.body.dateDue == "") {
    req.body.dateDue = tempdate;
  };

  if (req.body.task == "") {
    req.body.task = "New Task: " + tempdate.substring(0,10);
  };

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {

      var createdNow =  new Date().toISOString();

      client.query(
        "INSERT INTO todos (task, task_priority, task_created, task_due) VALUES ($1, $2, $3, $4) RETURNING *;",
        [ req.body.task, req.body.priority, createdNow, req.body.dateDue],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            if (verbose) console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }  // closes client query return function
      );  // closes client query
    }; // closes initial else
  }); // closes pool.connection
}); // closes post


router.delete("/:id", function(req, res) { // deleting todos
  if (verbose) console.log(req.body, 'req.body delete');
  if (verbose) console.log(req.params, 'req.params delete');

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to database", err);
      res.sendStatus(500);
      done(); // returns the connection
    } else {
      // no error occurred, time to query
      client.query( "DELETE FROM todos WHERE id = $1", [req.params.id] ,
      function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            if (verbose) console.log('deleted');
            res.sendStatus(204);
          }
        }  // closes client query return function
      );  // closes client query
    }; // closes initial else
  }); // closes pool.connection
}); // closes delete



router.get("/current", function(req, res) {  // getting the list of todos
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to database", err);
      res.sendStatus(500);
      done(); // returns the connection
    } else {
      // no error occurred, time to query
      client.query( "SELECT * FROM todos WHERE task_completed IS NULL ORDER BY task_due ASC", function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            if (verbose) console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }  // closes client query return function
      );  // closes client query
    }; // closes initial else
  }); // closes pool.connection
}); // closes get


router.get("/complete", function(req, res) {  // getting the list of todos
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to database", err);
      res.sendStatus(500);
      done(); // returns the connection
    } else {
      // no error occurred, time to query
      client.query( "SELECT * FROM todos WHERE task_completed IS NOT NULL ORDER BY task_due ASC", function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            if (verbose) console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }  // closes client query return function
      );  // closes client query
    }; // closes initial else
  }); // closes pool.connection
}); // closes get


module.exports = router;
