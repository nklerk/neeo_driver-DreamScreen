'use strict';

const BluePromise = require('bluebird');
const DreamscreenClient = require('dreamscreen-node').Client;
const client = new DreamscreenClient();
const POWER_ON_INTEGER = 1;


client.on('light-new', (dreamscreen) => {
  console.log('discovered new light', dreamscreen.serialNumber);
  //deviceState.addDevice(dreamscreen.serialNumber, dreamscreen);
});

client.on('light-online', (dreamscreen) => {
  console.log('light-online', dreamscreen.serialNumber);
  deviceState.updateReachable(dreamscreen.serialNumber, true);
});

client.on('light-offline', (dreamscreen) => {
  console.log('light-offline', dreamscreen.serialNumber);
  //deviceState.updateReachable(dreamscreen.serialNumber, false);
});

client.on('listening', function () {
  var address = client.address();
  console.log(
      'Started DreamScreen listening on ' +
      address.address + ':' + address.port + '\n'
  );
});


client.init();

module.exports.allDevices = function allDevices(){
  let devices = [];
  for (let id in client.devices) {
    devices.push(client.devices[id]);
  }
  return devices;
}


module.exports.getPowerState = function getPowerState(deviceId) {
  console.log("== Controller requested PowerState of: "+deviceId);
}

module.exports.getBrightness = function getBrightness(deviceId) {
  console.log("== Controller requested Brightness of: "+deviceId);
}

module.exports.setPowerState = function setPowerState(deviceId, value) {
  console.log("== Controller requested to set the PowerState of: "+deviceId+" to "+value);
  if (value === "false") {
    setMode(deviceId, 0);
  } else {
    setMode(deviceId, 3);
  }
}

function setMode(deviceId, value) {
  console.log("== Controller requested to set the mode of: "+deviceId+" to "+value);
  client.light(deviceId).setMode(value, function (err) {
    if (err) {
      console.log(`${client.light(deviceId).name} set Mode ${value} failed`);
    } else {
      console.log(`${client.light(deviceId).name} set Mode ${value} success`);
    }
  });
} module.exports.setMode = setMode;

module.exports.setBrightness = function setBrightness(deviceId, value) {
  console.log("== Controller requested to set Brightness of: "+deviceId);
  client.light(deviceId).setBrightness(parseInt(value, 10), function (err) {
    if (err) {
      console.log(`${client.light(deviceId).name} set Brightness ${value} failed`);
    } else {
      console.log(`${client.light(deviceId).name} set Brightness ${value} success`);
    }
  });
}

module.exports.setInput = function setInput(deviceId, value) {
  console.log("== Controller requested to set the input of: "+deviceId+" to "+value);
}