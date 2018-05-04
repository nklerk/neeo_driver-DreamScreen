'use strict';

const BluePromise = require('bluebird');
const DreamscreenClient = require('dreamscreen-node').Client;
const client = new DreamscreenClient();

client.on('listening', function () {
  var address = client.address();
  console.log(
      'Started DreamScreen listening on ' +
      address.address + ':' + address.port + '\n'
  );
});

module.exports.init = function(){
  client.init();
}

module.exports.allDevices = function allDevices(){
  let devices = [];
  for (let id in client.devices) {
    devices.push(client.devices[id]);
  }
  return devices;
}

module.exports.getPowerState = function getPowerState(deviceId) {
  console.log("== Controller requested PowerState of: "+deviceId);
  if (client.light(deviceId).mode == 0 ) {
    return false;
  } else {
    return true;
  }
}

module.exports.getBrightness = function getBrightness(deviceId) {
  console.log("== Controller requested Brightness of: "+deviceId);
  return client.light(deviceId).brightness; 
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

function setAmbiMode(deviceId, value){
  if (value < 0) {
    client.light(deviceId).setAmbientModeType(0, function (err) {
      if (err) { console.log(`${client.light(deviceId).name} set Ambient Mode Type ${value} failed`);   }
    });
  } else {
    client.light(deviceId).setAmbientModeType(1, function (err) {
      if (err) { console.log(`${client.light(deviceId).name} set Ambient Mode Type ${value} failed`);   }
    });
    client.light(deviceId).setAmbientShow(value, function (err) {
      if (err) { console.log(`${client.light(deviceId).name} set Ambient Show ${value} failed`);   }
    });
  }
} module.exports.setAmbiMode = setAmbiMode;

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
  client.light(deviceId).setHdmiInput(value, function (err) {
    if (err) {
      console.log(`${client.light(deviceId).name} set Input ${value} failed`);
    } else {
      console.log(`${client.light(deviceId).name} set Input ${value} success`);
    }
  });
}