// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


var usernames = {};
// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  // when the client emits 'new message', this listens and executes
  socket.on('receive message', function (data) {
      usernames[data.recipient].emit("receive message", {amount:data.amount});
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add username', function (username) {
      usernames[username] = socket;
  });

});
