const path = require('path');
const url = require('url');
const electron = require('electron');
const logger = require('./src/utils/logger');
const usbPort = require('./src/utils/usbPort');
const { IS_RPI: isPi } = require('./src/constants');
const { app, BrowserWindow, ipcMain } = electron;

let win, usbPath;

const mode = process.env.NODE_ENV;

function reloadOnChange(win) {
  if (mode !== 'development' && mode !== 'test') return { close: () => {} };

  const watcher = require('chokidar').watch(
    path.join(__dirname, 'dist', '**'),
    {
      ignoreInitial: true,
    }
  );

  watcher.on('change', () => {
    win.reload();
  });

  return watcher;
}

function initPeripherals(win) {
  const serial = require(`./src/utils/serial${isPi ? '' : '.mock'}`);
  usbPort.init();
  usbPort.on('add', (path) => {
    usbPath = path;
    win.webContents.send('usbConnected', usbPath);
  });
  usbPort.on('remove', () => {
    win.webContents.send('usbDisconnected');
    usbPath = void 0;
  });
  ipcMain.on('usbStatusRequest', (e) => {
    e.returnValue = !!usbPath;
  });
  serial.on('data', (d) => win.webContents.send('serialData', d));
  ipcMain.on('createFile', (_, ...args) => logger.createFile(...args));
  ipcMain.on('excelRow', (_, ...args) => logger.writeRow(...args));
  ipcMain.on('serialCommand', (_, ...args) => serial.sendCommand(...args));
  ipcMain.on('ejectUSB', usbPort.eject);
  ipcMain.on('saveFile', (e, fId) => {
    logger.saveFile(fId, usbPath, (err) => {
      if (err) console.log(err);
      e.reply(fId + 'Saved', err);
    });
  });
  return {
    removeAllListeners() {
      serial.close(console.error);
      usbPort.removeAllListeners();
    },
  };
}

function launch() {
  const screenArea = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: isPi ? screenArea.width : 1024,
    height: isPi ? screenArea.height : 600,
    fullscreen: isPi,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, './static/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  const watcher = reloadOnChange(win);
  const peripherals = initPeripherals(win);

  win.on('close', function () {
    peripherals.removeAllListeners();
    win = null;
    watcher.close();
  });
}

app.on('ready', launch);
