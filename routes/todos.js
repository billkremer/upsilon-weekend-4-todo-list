var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "upsilon_todolist" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);
