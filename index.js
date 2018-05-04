'use strict';
const DEBUG='neeo:*'
// DreamScreen discovery and controller by Niels de Klerk (@nklerk)
const debug = require('debug');
const neeosdk = require('neeo-sdk');
const dshd4kcontroller = require('./hd4kdreamscreencontroller.js');
const dsskcontroller = require('./skdreamscreencontroller');

const BRIGHTNESS_SLIDER = {
  name: 'brightness',
  label: 'Dimmer',
  range: [0, 100],
  unit: '%'
};

const POWER_SWITCH = {
  name: 'power',
  label: 'Power'
};

const DISCOVERY_INSTRUCTIONS = {
  headerText: 'Discover devices',
  description: 'NEEO will discover your DreamScreen lights now, press NEXT'
};

const INPUT_HDMI_1 = { name: 'INPUT_HDMI_1', label: 'Input HDMI 1' };
const INPUT_HDMI_2 = { name: 'INPUT_HDMI_2', label: 'Input HDMI 2' };
const INPUT_HDMI_3 = { name: 'INPUT_HDMI_3', label: 'Input HDMI 3' };
const MODE_MUSIC = { name: 'MODE_MUSIC', label: 'Mode Music' };
const MODE_VIDEO = { name: 'MODE_VIDEO', label: 'Mode Video' };
const MODE_AMBIENT = { name: 'MODE_AMBIENT', label: 'Mode Ambient' };
const AMBIENT_Solid_Color = { name: 'AMBIENT_Solid_Color', label: 'Solid Color' };
const AMBIENT_Random_Color = { name: 'AMBIENT_Random_Color', label: 'Random Color' };
const AMBIENT_Fireside = { name: 'AMBIENT_Fireside', label: 'Fireside' };
const AMBIENT_Twinkle = { name: 'AMBIENT_Twinkle', label: 'Twinkle' };
const AMBIENT_Ocean = { name: 'AMBIENT_Ocean', label: 'Ocean' };
const AMBIENT_Rainbow = { name: 'AMBIENT_Rainbow', label: 'Rainbow' };
const AMBIENT_July_4th = { name: 'AMBIENT_July_4th', label: 'July 4th' };
const AMBIENT_Holiday = { name: 'AMBIENT_Holiday', label: 'Holiday' };
const AMBIENT_Pop = { name: 'AMBIENT_Pop', label: 'Pop' };
const AMBIENT_Enchanted_Forest = { name: 'AMBIENT_Enchanted_Forest', label: 'Enchanted Forest' };



const dshd4k = neeosdk.buildDevice('HD / 4K')
  .setManufacturer('DreamScreen')
  .addAdditionalSearchToken('Ambi')
  .setType('LIGHT')
  .addButtonGroup('Power')
  .addButton(INPUT_HDMI_1)
  .addButton(INPUT_HDMI_2)
  .addButton(INPUT_HDMI_3)
  .addButton(MODE_MUSIC)
  .addButton(MODE_VIDEO)
  .addButton(MODE_AMBIENT)
  .addButton(AMBIENT_Solid_Color)
  .addButton(AMBIENT_Random_Color)
  .addButton(AMBIENT_Fireside)
  .addButton(AMBIENT_Twinkle)
  .addButton(AMBIENT_Ocean)
  .addButton(AMBIENT_Rainbow)
  .addButton(AMBIENT_July_4th)
  .addButton(AMBIENT_Holiday)
  .addButton(AMBIENT_Pop)
  .addButton(AMBIENT_Enchanted_Forest)
  .addButtonHandler(dshd4kcontroller.onButtonPressed)
  .addSlider(BRIGHTNESS_SLIDER, dshd4kcontroller.brightnessSliderCallback)
  .addSwitch(POWER_SWITCH, dshd4kcontroller.powerSwitchCallback)
  .enableDiscovery(DISCOVERY_INSTRUCTIONS, dshd4kcontroller.discoverDevices)
  .registerSubscriptionFunction(dshd4kcontroller.registerStateUpdateCallback)
  .registerInitialiseFunction(dshd4kcontroller.initialise)
;

const dssk = neeosdk.buildDevice('SideKick')
  .setManufacturer('DreamScreen')
  .addAdditionalSearchToken('Spot')
  .setType('LIGHT')
  .addButtonGroup('Power')
  .addButtonHandler(dsskcontroller.onButtonPressed)
  .addSlider(BRIGHTNESS_SLIDER, dsskcontroller.brightnessSliderCallback)
  .addSwitch(POWER_SWITCH, dsskcontroller.powerSwitchCallback)
  .enableDiscovery(DISCOVERY_INSTRUCTIONS, dsskcontroller.discoverDevices)
  .registerSubscriptionFunction(dsskcontroller.registerStateUpdateCallback)
  .registerInitialiseFunction(dsskcontroller.initialise)
;

console.log('- Brain discovered:');

    console.log('- Start server');
    return neeosdk.startServer({
      brain: "10.2.1.64",
      port: 6336,
      name: 'DreamScreen',
      devices: [dssk, dshd4k]
    });
    /* 
console.log('- discover one NEEO Brain...');
neeosdk.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeosdk.startServer({
      brain,
      port: 6336,
      name: 'DreamScreen',
      devices: [dssk, dshd4k]
    });
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "DreamScreen".');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  }); */