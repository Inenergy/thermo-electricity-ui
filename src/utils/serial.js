const Serial = require('serialport');
const { PORT, SEPARATOR } = require('../constants');
const parse = require('./parser');
const EventEmitter = require('events');

const emitter = new EventEmitter();
const serial = new Serial(PORT.name, { baudRate: PORT.baudRate });

serial.on('error', (e) => {
  throw e;
});

const buffer = Buffer.alloc(52);
let offset = 0;

serial.on('data', handleBuffer);

function handleBuffer(buf) {
  if (buf.toString('ascii').startsWith('ok')) buf = buf.slice(2);
  idx = buf.indexOf(SEPARATOR);
  if (idx != -1) {
    buf.copy(buffer, offset, 0, idx);
    try {
      emitter.emit('data', parse(buffer.slice()));
    } catch (e) {
      console.error(e.message);
    }
    offset = 0;
    buf.copy(buffer, offset, idx);
    offset = buf.length;
  } else {
    buf.copy(buffer, offset);
    offset += buf.length;
  }
}

let commandQueue = [];
let portBusy = false;

function sendCommand(byte1, byte2 = 0) {
  commandQueue.push(Buffer.from([10, byte1, byte2, byte1 + byte2 + 10]));
  if (!portBusy) {
    portBusy = true;
    writeCommandFromQueue();
  }
}

function writeCommandFromQueue() {
  if (!commandQueue.length) {
    portBusy = false;
    return;
  }
  const cmd = commandQueue.shift();
  console.log('Sending Command to COM', cmd);
  serial.write(cmd);
  serial.once('data', (buf) => {
    console.log('Recived confirm:', buf.toString('ascii'));
    if (!buf.toString('ascii').startsWith('ok')) {
      commandQueue.unshift(cmd);
    }
    writeCommandFromQueue();
  });
  // serial.once('data', checkConfirm);
  // function checkConfirm(buf) {
  //   console.log('Recieved confirm:', buf.toString('ascii'));
  //   if (!buf.toString('ascii').startsWith('ok')) {
  //     serial.once('data', checkConfirm)
  //   }
  // }
}

emitter.sendCommand = sendCommand;
emitter.close = (cb) => serial.close(cb);

module.exports = emitter;
