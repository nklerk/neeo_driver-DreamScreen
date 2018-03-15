'use strict';

// DreamScreen discovery and controller by Niels de Klerk (@nklerk)

const neeosdk = require('neeo-sdk');
const controller = require('./dreamscreencontroller');

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

const dshd = neeosdk.buildDevice('HD')
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
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(BRIGHTNESS_SLIDER, controller.brightnessSliderCallback)
  .addSwitch(POWER_SWITCH, controller.powerSwitchCallback)
  .enableDiscovery(DISCOVERY_INSTRUCTIONS, controller.discoverDevices)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .registerInitialiseFunction(controller.initialise)
;

const ds4k = neeosdk.buildDevice('4K')
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
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(BRIGHTNESS_SLIDER, controller.brightnessSliderCallback)
  .addSwitch(POWER_SWITCH, controller.powerSwitchCallback)
  .enableDiscovery(DISCOVERY_INSTRUCTIONS, controller.discoverDevices)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .registerInitialiseFunction(controller.initialise)
;

const dssk = neeosdk.buildDevice('SideKick')
  .setManufacturer('DreamScreen')
  .addAdditionalSearchToken('Spot')
  .setType('LIGHT')
  .addButtonGroup('Power')
  .addButtonHandler(controller.onButtonPressed)
  .addSlider(BRIGHTNESS_SLIDER, controller.brightnessSliderCallback)
  .addSwitch(POWER_SWITCH, controller.powerSwitchCallback)
  .enableDiscovery(DISCOVERY_INSTRUCTIONS, controller.discoverDevices)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .registerInitialiseFunction(controller.initialise)
;


console.log('- discover one NEEO Brain...');
neeosdk.discoverOneBrain()
  .then((brain) => {
    console.log('- Brain discovered:', brain.name);

    console.log('- Start server');
    return neeosdk.startServer({
      brain,
      port: 6336,
      name: 'DreamScreen',
      devices: [dshd, ds4k, dssk]
    });
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "DreamScreen".');
  })
  .catch((err) => {
    console.error('ERROR!', err);
    process.exit(1);
  });