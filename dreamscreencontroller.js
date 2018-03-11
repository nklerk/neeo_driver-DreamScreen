'use strict';

//const DreamscreenService = require('./dreamscreenservice');
const dreamscreenService = require('./dreamscreenservice');
const neeoapi = require('neeo-sdk');

// the mobile app polls each 4500ms
const DEVICE_POLL_TIME_MS = 4000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const MACRO_ALERT = 'ALERT';
const INPUT_HDMI_1 = 'INPUT_HDMI_1';
const INPUT_HDMI_2 = 'INPUT_HDMI_2';
const INPUT_HDMI_3 = 'INPUT_HDMI_3';
const MODE_MUSIC = 'MODE_MUSIC';
const MODE_VIDEO = 'MODE_VIDEO';
const MODE_AMBIENT = 'MODE_AMBIENT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';
const COMPONENT_AMBIENTLIGHT = 'ambientlight';

const deviceState = neeoapi.buildDeviceState();
//let dreamscreenService;
let sendMessageToBrainFunction;
let pollingIntervalId;

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
      return dreamscreenService.setPowerState(deviceId, "true"); //Change to correct function
    case MACRO_POWER_OFF:
      console.log(`Powering off ${deviceId}`);
      return dreamscreenService.setPowerState(deviceId, "false"); //Change to correct function
    case INPUT_HDMI_1:
      console.log(`Set input to HDMI 1 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 1);  //Change to correct function
    case INPUT_HDMI_2:
      console.log(`Set input to HDMI 2 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 2); //Change to correct function
    case INPUT_HDMI_3:
      console.log(`Set input to HDMI 3 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 3); //Change to correct function
    case MODE_MUSIC:
      console.log(`Set mode to music on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 2); //Change to correct function
    case MODE_VIDEO:
      console.log(`Set mode to video on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 1); //Change to correct function
    case MODE_AMBIENT:
      console.log(`Set mode to ambient on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 3); //Change to correct function
    default:
      console.log(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }
};

module.exports.discoverDevices = function() {
  console.log('discovery call');
  
  const allDevices = dreamscreenService.allDevices();
  return dreamscreenService.allDevices()
    .map((deviceEntry) => {
      return {
        id: deviceEntry.serialNumber,
        name: deviceEntry.name,
        reachable: deviceEntry.isReachable
      };
    });
};

function sendNotificationToBrain(uniqueDeviceId, component, value) {
  sendMessageToBrainFunction({ uniqueDeviceId, component, value })
    .catch((error) => {
      console.log('NOTIFICATION_FAILED', error.message);
    });
}

function pollAllDreamscreenDevices() {
  console.log('poll all dreamscreen devices');
  deviceState.getAllDevices()
    .forEach((dreamscreen) => {
      if (!dreamscreen.reachable) {
        return;
      }
      dreamscreenService
        .getStateForPolling(dreamscreen.id)
        .then((deviceState) => {
          sendNotificationToBrain(dreamscreen.id, COMPONENT_BRIGHTNESS, deviceState.brightness);
          sendNotificationToBrain(dreamscreen.id, COMPONENT_POWER, deviceState.power);
        })
        .catch((error) => {
          console.log('polling failed', error.message);
        });
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
  console.log('initialise dreamscreen service, start polling');
  //dreamscreenService = new DreamscreenService(deviceState);
  pollingIntervalId = setInterval(pollAllDreamscreenDevices, DEVICE_POLL_TIME_MS);
};