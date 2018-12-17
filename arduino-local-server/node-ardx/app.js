const express = require('express');
const http = require('http');
const path = require('path');
const five = require('johnny-five')
let socket = require('socket.io-client')('http://localhost:3000/arduino')
const app = express();
app.set('port', process.env.PORT || 3002);
app.use(express.bodyParser());


const board = new five.Board({port: 'COM4', repl: false})
board.on("ready", function() {

});

socket.on('hello', ({value})=>{
  console.log("get hello: " + value);
  if(board.isReady){
    board.pinMode(13, board.MODES.OUTPUT)
    board.digitalWrite(13, board.pins[13].value? 0: 1)
  }
})





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
