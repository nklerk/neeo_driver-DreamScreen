'use strict';

const dreamscreenService = require('./dreamscreenservice');
const neeoapi = require('neeo-sdk');

const DEVICE_POLL_TIME_MS = 1000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';

const deviceState = neeoapi.buildDeviceState();
let sendMessageToBrainFunction;
let pollingIntervalId;
let notificationcache = [];

function setBrightness(deviceId, value) {
  return dreamscreenService.setBrightness(deviceId, value);
}

function getBrightness(deviceId) {
  return dreamscreenService.getBrightness(deviceId);
}

function setPowerState(deviceId, value) {
  return dreamscreenService.setPowerState(deviceId, value);
}

function getPowerState(deviceId) {
  return dreamscreenService.getPowerState(deviceId);
}

module.exports.brightnessSliderCallback = {
  setter: setBrightness,
  getter: getBrightness,
};

module.exports.powerSwitchCallback = {
  setter: setPowerState,
  getter: getPowerState,
};

module.exports.onButtonPressed = (action, deviceId) => {
  switch (action) {
    case MACRO_POWER_ON:
      console.log(`Powering on ${deviceId}`);
      return dreamscreenService.setPowerState(deviceId, "true");
    case MACRO_POWER_OFF:
      console.log(`Powering off ${deviceId}`);
      return dreamscreenService.setPowerState(deviceId, "false");
    default:
      console.log(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }
};

function isSK(obj) {
  if ('productId' in obj && typeof(obj.productId) === 'number' && !isNaN(obj.productId)) {
    if (obj.productId == 3){
      return true;
    }
  } 
  return false;
}

module.exports.discoverDevices = function() {
  console.log('discovery call'); 
  const allDevices = dreamscreenService.allDevices();
  return dreamscreenService.allDevices()
    .filter(isSK)
    .map((deviceEntry) => {
      return {
        id: deviceEntry.serialNumber,
        name: tclean(deviceEntry.name),
        reachable: deviceEntry.isReachable
      };
    }); 
};

// must be fixed at dreamscreen-node for name and groupname
function tclean(text){
  text = text.replace(/\0/g, '');
  return text
}

function sendNotificationToBrain(uniqueDeviceId, component, value) {
  if (notificationcache[uniqueDeviceId, component] !== value){    //exclude duplicate polling.
    notificationcache[uniqueDeviceId, component] = value;
    console.log("SEND_NOTIFICATION: ", uniqueDeviceId, component, value);
    sendMessageToBrainFunction({ uniqueDeviceId, component, value })
    .catch((error) => {
      console.log('NOTIFICATION_FAILED', error.message);
    });
  }
}

function pollAllDreamscreenDevices() {
  dreamscreenService.allDevices()
    .filter(isSK)
    .forEach((dreamscreen) => {
      sendNotificationToBrain(dreamscreen.serialNumber, COMPONENT_BRIGHTNESS, dreamscreen.brightness);
      
      let powerstate = true;
      if (dreamscreen.mode == 0 ) {powerstate = false};
      sendNotificationToBrain(dreamscreen.serialNumber, COMPONENT_POWER, powerstate);
  });
}

module.exports.registerStateUpdateCallback = function(_sendMessageToBrainFunction) {
  console.log('registerStateUpdateCallback');
  sendMessageToBrainFunction = _sendMessageToBrainFunction;
};

module.exports.initialise = function() {
  if (pollingIntervalId) {
    console.log('already initialised, ignore call');
    return false;
  }
  console.log('initialise dreamscreen Sidekick service, start polling');
  dreamscreenService.init();
  pollingIntervalId = setInterval(pollAllDreamscreenDevices, DEVICE_POLL_TIME_MS);
};