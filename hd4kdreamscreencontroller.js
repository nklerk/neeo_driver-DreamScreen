'use strict';

const dreamscreenService = require('./dreamscreenservice');
const neeoapi = require('neeo-sdk');

const DEVICE_POLL_TIME_MS = 1000;
const MACRO_POWER_ON = 'POWER ON';
const MACRO_POWER_OFF = 'POWER OFF';
const MACRO_POWER_TOGGLE = 'POWER_TOGGLE';
const INPUT_HDMI_1 = 'INPUT_HDMI_1';
const INPUT_HDMI_2 = 'INPUT_HDMI_2';
const INPUT_HDMI_3 = 'INPUT_HDMI_3';
const MODE_MUSIC = 'MODE_MUSIC';
const MODE_VIDEO = 'MODE_VIDEO';
const MODE_AMBIENT = 'MODE_AMBIENT';
const COMPONENT_BRIGHTNESS = 'brightness';
const COMPONENT_POWER = 'power';
const AMBIENT_Solid_Color = 'AMBIENT_Solid_Color';
const AMBIENT_Random_Color = 'AMBIENT_Random_Color';
const AMBIENT_Fireside = 'AMBIENT_Fireside';
const AMBIENT_Twinkle = 'AMBIENT_Twinkle';
const AMBIENT_Ocean = 'AMBIENT_Ocean';
const AMBIENT_Rainbow = 'AMBIENT_Rainbow';
const AMBIENT_July_4th = 'AMBIENT_July_4th';
const AMBIENT_Holiday = 'AMBIENT_Holiday';
const AMBIENT_Pop = 'AMBIENT_Pop';
const AMBIENT_Enchanted_Forest = 'AMBIENT_Enchanted_Forest';

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
    case INPUT_HDMI_1:
      console.log(`Set input to HDMI 1 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 0);  
    case INPUT_HDMI_2:
      console.log(`Set input to HDMI 2 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 1); 
    case INPUT_HDMI_3:
      console.log(`Set input to HDMI 3 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, 2); 
    case MODE_MUSIC:
      console.log(`Set mode to music on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 2); 
    case MODE_VIDEO:
      console.log(`Set mode to video on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 1); 
    case MODE_AMBIENT:
      console.log(`Set mode to ambient on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, 3); 
    case AMBIENT_Solid_Color:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, -1);
    case AMBIENT_Random_Color:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 0);
    case AMBIENT_Fireside:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 1);
    case AMBIENT_Twinkle:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 2);
    case AMBIENT_Ocean:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 3);
    case AMBIENT_Rainbow:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 4);
    case AMBIENT_July_4th:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 5);
    case AMBIENT_Holiday:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 6);
    case AMBIENT_Pop:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 7);
    case AMBIENT_Enchanted_Forest:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, 8);
    default:
      console.log(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }
};

function isHD4K(obj) {
  if ('productId' in obj && typeof(obj.productId) === 'number' && !isNaN(obj.productId)) {
    if (obj.productId == 1 || obj.productId == 2){
      return true;
    }
  } 
  return false;
}

module.exports.discoverDevices = function() {
  console.log('discovery call'); 
  const allDevices = dreamscreenService.allDevices();
  return dreamscreenService.allDevices()
    .filter(isHD4K)
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
    .filter(isHD4K)
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
  console.log (sendMessageToBrainFunction);
};

module.exports.initialise = function() {
  if (pollingIntervalId) {
    console.log('already initialised, ignore call');
    return false;
  }
  console.log('initialise dreamscreen HD/4K service, start polling');
  dreamscreenService.init();
  pollingIntervalId = setInterval(pollAllDreamscreenDevices, DEVICE_POLL_TIME_MS);
};