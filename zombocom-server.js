var sys = require("sys"),
    readFile = require("fs").readFile,
    ws = require('./deps/node-websocket-server/lib/ws');

var HOST = "localhost",
    PORT = 8888,
    DEBUG = true,
    CLIENT_FILE = "zombocom-client.html";

// Welcome to zombocom. ------------------------
var zombocom = [
  'Welcome to zombocom.',
  'Anything is possible at zombocom.',
  'Anything at all.',
  'This is zombocom, welcome.',
  'The infinite is possible at zombocom.',
  'Yes.',
  'The unattainable is unknown at zombocom.',
  'This is zombocom.',
  'Anything at all.',
  'Welcome.',
  'Yes, this is zombocom.',
  'The only limit is yourself.',
  'Anything is possible at zombocom.',
  'You can do anything at zombocom.',
  'This is zombocom, and welcome to you who have come to zombocom.'
];

// Server --------------------------------------
var server = ws.createServer({ debug: DEBUG });

server.addListener("listening", function() {
  sys.puts("Listening for connections at ws://" + HOST + ':' + PORT);
});

// Handle WebSocket Requests
server.addListener("connection", function( conn ) {

  var i=0,
      maxlen = zombocom.length - 1;

  sys.puts( "opened connection: "+conn._id );

  // send initial message directly to the user
  server.send(conn._id, zombocom[i]);

  // zombocom magic infinite loop
  setInterval( function() {
    i = (i < maxlen) ? i+1 : 0;
    server.broadcast( zombocom[i] );
  }, 10 * 1000);
  
  conn.addListener("message", function( message ) {
    sys.puts("<"+conn._id+"> "+message);
  });
});

server.addListener("close", function( conn ) {
  sys.puts("closed connection: "+conn._id);
});

// Handle HTTP Requests
server.addListener("request", function( req, res ) {

  var filename = CLIENT_FILE,
      headers,
      body,

      loadResponseData = function( callback ) {
        if (body && headers) {
          callback();
          return;
        }
        readFile( filename, function (err, data) {
          if (err) {
            sys.puts("Error loading " + filename);
          } else {
            body = data;
            headers = {
              "Content-Type": 'text/html',
              "Content-Length": body.length
            };
            callback();
          }
        });
      };

  loadResponseData(function () {
    res.writeHead(200, headers);
    res.end(body);
  });
});

// This is zombocom.
server.listen(PORT, HOST);