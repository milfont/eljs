var express = require('express');
var fs = require("fs");

var app = express.createServer();
app.set('views', __dirname + '/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');

app.use(express.bodyParser());
app.use(express.cookieParser());
  
app.use(express.session({ secret: 'milfont' }));

app.use(app.router);

app.get('/', function(req, res) {
  res.send("Javascript Fundamental");
});

app.use(express.errorHandler({ showStack: true }));
app.use(express.static(__dirname));
app.listen(8001);

