"use strict";

const dreamscreenService = require("./dreamscreenservice");
const dsConst = require("./ds-constants");

const MACRO_POWER_ON = "POWER ON";
const MACRO_POWER_OFF = "POWER OFF";
const INPUT_HDMI_1 = "INPUT_HDMI_1";
const INPUT_HDMI_2 = "INPUT_HDMI_2";
const INPUT_HDMI_3 = "INPUT_HDMI_3";
const MODE_MUSIC = "MODE_MUSIC";
const MODE_VIDEO = "MODE_VIDEO";
const MODE_AMBIENT = "MODE_AMBIENT";
const AMBIENT_Solid_Color = "AMBIENT_Solid_Color";
const AMBIENT_Random_Color = "AMBIENT_Random_Color";
const AMBIENT_Fireside = "AMBIENT_Fireside";
const AMBIENT_Twinkle = "AMBIENT_Twinkle";
const AMBIENT_Ocean = "AMBIENT_Ocean";
const AMBIENT_Rainbow = "AMBIENT_Rainbow";
const AMBIENT_July_4th = "AMBIENT_July_4th";
const AMBIENT_Holiday = "AMBIENT_Holiday";
const AMBIENT_Pop = "AMBIENT_Pop";
const AMBIENT_Enchanted_Forest = "AMBIENT_Enchanted_Forest";

module.exports = {
  brightnessSliderCallback: {
    setter: setBrightness,
    getter: getBrightness
  },
  powerSwitchCallback: {
    setter: setPowerState,
    getter: getPowerState
  },
  onButtonPressed,
  discoverDevicesHD4K,
  discoverDevicesSK,
  initialise
};

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

function onButtonPressed(action, deviceId) {
  switch (action) {
    case MACRO_POWER_ON:
      console.log(`Powering on ${deviceId}`);
      return dreamscreenService.setPowerState(deviceId, true);
    case MACRO_POWER_OFF:
      console.log(`Powering off ${deviceId}`);
      return dreamscreenService.setPowerState(deviceId, false);
    case INPUT_HDMI_1:
      console.log(`Set input to HDMI 1 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, dsConst.HDMIINPUT_1);
    case INPUT_HDMI_2:
      console.log(`Set input to HDMI 2 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, dsConst.HDMIINPUT_2);
    case INPUT_HDMI_3:
      console.log(`Set input to HDMI 3 on ${deviceId}`);
      return dreamscreenService.setInput(deviceId, dsConst.HDMIINPUT_3);
    case MODE_MUSIC:
      console.log(`Set mode to music on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, dsConst.MODE_MUSIC);
    case MODE_VIDEO:
      console.log(`Set mode to video on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, dsConst.MODE_VIDEO);
    case MODE_AMBIENT:
      console.log(`Set mode to ambient on ${deviceId}`);
      return dreamscreenService.setMode(deviceId, dsConst.MODE_AMBIENT);
    case AMBIENT_Solid_Color:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_RGB);
    case AMBIENT_Random_Color:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_RANDOMCOLOR);
    case AMBIENT_Fireside:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_FIRESIDE);
    case AMBIENT_Twinkle:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_TWINKLE);
    case AMBIENT_Ocean:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_OCEAN);
    case AMBIENT_Rainbow:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_RAINBOW);
    case AMBIENT_July_4th:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_JULY4TH);
    case AMBIENT_Holiday:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_HOLIDAY);
    case AMBIENT_Pop:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_POP);
    case AMBIENT_Enchanted_Forest:
      console.log(`Set ambient on ${deviceId}`);
      return dreamscreenService.setAmbiMode(deviceId, dsConst.AMBIENTSCENE_ENCHANTEDFOREST);
    default:
      console.log(`Unsupported button: ${action} for ${deviceId}`);
      return Promise.resolve(false);
  }
}

function isHD4K(obj) {
  if ("productId" in obj && typeof obj.productId === "number" && !isNaN(obj.productId)) {
    return obj.productId == dsConst.PRODUCT_HD || obj.productId == dsConst.PRODUCT_4K;
  } else {
    return false;
  }
}

function isSK(obj) {
  if ("productId" in obj && typeof obj.productId === "number" && !isNaN(obj.productId)) {
    if (obj.productId == dsConst.PRODUCT_SK) {
      return true;
    }
  }
  return false;
}

function discoverDevicesHD4K() {
  console.log("discovery call");
  return dreamscreenService
    .allDevices()
    .filter(isHD4K)
    .map(deviceEntry => {
      return {
        id: deviceEntry.serialNumber,
        name: tclean(deviceEntry.name),
        reachable: deviceEntry.isReachable
      };
    });
}

function discoverDevicesSK() {
  console.log("discovery call");
  return dreamscreenService
    .allDevices()
    .filter(isSK)
    .map(deviceEntry => {
      return {
        id: deviceEntry.serialNumber,
        name: tclean(deviceEntry.name),
        reachable: deviceEntry.isReachable
      };
    });
}

function tclean(text) {
  text = text.replace(/\0/g, "");
  return text;
}

function initialise() {
  return dreamscreenService.init();
}
