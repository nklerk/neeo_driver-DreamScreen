"use strict";

const DreamscreenClient = require("dreamscreen-node").Client;
const dsConst = require("./ds-constants");
const client = new DreamscreenClient();

const COMPONENT_BRIGHTNESS = "brightness";
const COMPONENT_POWER = "power";
let clientInitiated = false;
let sendMessageToBrainFunctionHD4K;
let sendMessageToBrainFunctionSK;
let notificationcache = [];

module.exports = {
  allDevices,
  getPowerState,
  getBrightness,
  setPowerState,
  setMode,
  setAmbiMode,
  setBrightness,
  setInput,
  registerStateUpdateCallbackHD4K,
  registerStateUpdateCallbackSK
};

client.on("light-new", function(light) {
  console.log(`EVENT:  New light found. IP: ${light.ipAddress}, NAME: ${light.name}`);
});

client.on("light-updated", function(light) {
  console.log(`EVENT:  Light updated. ID:${light.serialNumber}, IP:${light.ipAddress}, NAME:${light.name}`);
  sendNotificationToBrain(light.serialNumber, COMPONENT_BRIGHTNESS, light.brightness, light.productId);
  const powerstate = light.mode !== dsConst.MODE_SLEEP;
  sendNotificationToBrain(light.serialNumber, COMPONENT_POWER, powerstate, light.productId);
});

client.on("light-online", function(light) {
  console.log(`EVENT:  Light online. ID:${light.serialNumber}, IP:${light.ipAddress}, NAME:${light.name}`);
  sendNotificationToBrain(light.serialNumber, COMPONENT_BRIGHTNESS, light.brightness, light.productId);
  const powerstate = light.mode !== dsConst.MODE_SLEEP;
  sendNotificationToBrain(light.serialNumber, COMPONENT_POWER, powerstate, light.productId);
});

client.on("light-offline", function(light) {
  console.log(`EVENT:  Light offline. ID:${light.serialNumber}, IP:${light.ipAddress}, NAME:${light.name}`);
  sendNotificationToBrain(light.serialNumber, COMPONENT_BRIGHTNESS, 0, light.productId);
  sendNotificationToBrain(light.serialNumber, COMPONENT_POWER, false, light.productId);
});

client.on("listening", function() {
  clientInitiated = true;
  const address = client.address();
  console.log(`EVENT:  Started DreamScreen listening on ${address.address}:${address.port}`);
});

client.on("error", error => {
  console.log(`EVENT: Error  ${error}`);
});

module.exports.init = function() {
  if (!clientInitiated) {
    client.init();
  }
};

function allDevices() {
  let devicesArr = [];
  for (let id in client.devices) {
    devicesArr.push(client.devices[id]);
  }
  return devicesArr;
}

function getPowerState(deviceId) {
  return client.light(deviceId).mode !== dsConst.MODE_SLEEP;
}

function getBrightness(deviceId) {
  return client.light(deviceId).brightness;
}

function setPowerState(deviceId, value) {
  if (client.light(deviceId)) {
    if (value) {
      setMode(deviceId, dsConst.MODE_AMBIENT);
    } else {
      setMode(deviceId, dsConst.MODE_SLEEP);
    }
  }
}

function setMode(deviceId, value) {
  if (client.light(deviceId)) {
    client.light(deviceId).setMode(value);
  }
}

function setAmbiMode(deviceId, value) {
  if (client.light(deviceId)) {
    if (value == dsConst.AMBIENTSCENE_RGB) {
      client.light(deviceId).setAmbientModeType(dsConst.AMBIENTMODE_RGB);
    } else {
      client.light(deviceId).setAmbientModeType(dsConst.AMBIENTMODE_SCENE);
      client.light(deviceId).setAmbientShow(value);
    }
  }
}

function setBrightness(deviceId, value) {
  if (client.light(deviceId)) {
    client.light(deviceId).setBrightness(parseInt(value, 10));
  }
}

function setInput(deviceId, value) {
  if (client.light(deviceId)) {
    client.light(deviceId).setHdmiInput(value);
  }
}

function registerStateUpdateCallbackHD4K(_sendMessageToBrainFunction) {
  sendMessageToBrainFunctionHD4K = _sendMessageToBrainFunction;
}

function registerStateUpdateCallbackSK(_sendMessageToBrainFunction) {
  sendMessageToBrainFunctionSK = _sendMessageToBrainFunction;
}

function sendNotificationToBrain(uniqueDeviceId, component, value, productId) {
  if (notificationcache[(uniqueDeviceId, component)] !== value) {
    notificationcache[(uniqueDeviceId, component)] = value;
    console.log("SEND_NOTIFICATION: ", uniqueDeviceId, component, value);
    if (productId == dsConst.PRODUCT_HD || productId == dsConst.PRODUCT_4K) {
      sendMessageToBrainFunctionHD4K({ uniqueDeviceId, component, value }).catch(error => {
        console.log("NOTIFICATION_FAILED: ", error.message);
      });
    } else if (productId == dsConst.PRODUCT_SK) {
      sendMessageToBrainFunctionSK({ uniqueDeviceId, component, value }).catch(error => {
        console.log("NOTIFICATION_FAILED: ", error.message);
      });
    } else {
      console.log("NOTIFICATION_FAILED: Unknown product");
    }
  }
}
