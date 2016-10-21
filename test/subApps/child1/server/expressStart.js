var express = require('express');

var app = express();

var child1 = require('child1');
var child2 = require('child2');

app.use("/api1",child1);
app.use("/api2",child2);

app.listen(3000, function() {
  console.log("Server started at 3000");
});
