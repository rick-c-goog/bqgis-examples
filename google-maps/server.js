const http = require('http');
const express = require('express');
var fs = require('fs');
var url = require('url');
const { emitWarning } = require('process');
//var app = express();
const hostname = '127.0.0.1';
const port = 8080;
//app.get('/',function(req,res) {
//  console.log("root call received:");
//  res.end("please use /boundary /stations");
//});
var app=http.createServer(function(req,res) {
  //res.setHeader('Content-Type', 'text/plain');
  var queryData = url.parse(req.url, true).query;
  //console.log("boundary call received:");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'text/html');
  //res.writeHead(200, { 'content-type': 'text/html' })
  //fs.createReadStream('index.html').pipe(res)
  //res.sendFile("index.html");

});

app.listen(port, function(req, res) {
    console.log("Server is running at port http://"+hostname+":"+port);
  });