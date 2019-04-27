const express = require('express');
const http = require('http');
const path = require('path');
const five = require('johnny-five')
let socket = require('socket.io-client')('http://localhost:3000/arduino')
const app = express();
app.set('port', process.env.PORT || 3002);
app.use(express.bodyParser());


let blocked = false;

const board = new five.Board({ port: 'COM5', repl: false })
board.on("ready", function () {

});

socket.on('hello', ({ value }) => {
  if (!blocked) {
    console.log("get hello: " + value);
    if (board.isReady) {
      board.pinMode(13, board.MODES.OUTPUT)
      board.digitalWrite(13, 1)
      board.wait(1000, () => {
        board.digitalWrite(13, 0)
      })
    }
  }
})
app.get('/', (req, res) => {
  res.send("hello")
})
app.post('/setstate', (req, res) => {
  const { height, unlock} = req.body
  //blocked = !unlock
  if (!blocked) {
    if (board.isReady) {
      console.log("get the Job man")
      board.pinMode(13, board.MODES.OUTPUT)
      board.digitalWrite(13, 1)
      board.wait(1000, () => {
        board.digitalWrite(13, 0)
      })
      res.send({msg:"OK"})
      console.log("ok");

    } else {
      res.send({ msg: "Device is not ready" })
    }
  }else{
    res.send({ msg: "Device is blocked" })
  }
  
})



http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});