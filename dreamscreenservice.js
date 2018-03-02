'use strict';

const BluePromise = require('bluebird');
const DreamscreenDeps = require('./dreamscreendeps');

const POWER_ON_INTEGER = 1;


class DreamscreenService {

  constructor(deviceState) {
    this.deviceState = deviceState;
    this.dreamscreenClient = DreamscreenDeps.buildDreamscreenClientInstance();
    this.dreamscreenClient.init();

    console.log('DREAMSCREEN discovery started...');
    this.dreamscreenClient.on('light-new', (dreamscreen) => {
      console.log('discovered new light', dreamscreen.id);
      deviceState.addDevice(dreamscreen.id, dreamscreen);
    });
    this.dreamscreenClient.on('light-online', (dreamscreen) => {
      console.log('light-online', dreamscreen.id);
      deviceState.updateReachable(dreamscreen.id, true);
    });
    this.dreamscreenClient.on('light-offline', (dreamscreen) => {
      console.log('light-offline', dreamscreen.id);
      deviceState.updateReachable(dreamscreen.id, false);
    });
  }

  stop() {
    this.dreamscreenClient.destroy();
  }


  getState(deviceId) {
    const light = this.deviceState.getClientObjectIfReachable(deviceId);
    if (!light) {
      return BluePromise.reject(new Error('NOT_REACHABLE'));
    }

    function getLampState() {
      return new BluePromise((resolve, reject) => {
        console.log('fetch new DREAMSCREEN state', deviceId);
        light.getState((err, state) => {
          if (err) {
            reject(err);
          }
          if (!state || !state.color) {
            reject(new Error('INVALID_ANSWER'));
          }
          resolve(state);
        });
      });
    }

    return this.deviceState
      .getCachePromise(deviceId)
      .getValue(getLampState);
  }

  getBrightness(deviceId) {
    return this.getState(deviceId)
      .then((state) => {
        return state.brightness;
      });
  }

  setBrightness(deviceId, brightnessString) {
    return new BluePromise((resolve, reject) => {
      const brightness = parseInt(brightnessString, 10);
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      light.brightness(brightness);
      resolve();
    });
  }

  setInput(deviceId, input) {
    return new BluePromise((resolve, reject) => {
      const input = parseInt(input, 10);
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      light.input(input);    
    });
  }

  setMode(deviceId, mode) {
    return new BluePromise((resolve, reject) => {
      const mode = parseInt(mode, 10);
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      light.mode(mode);    
    });
  }

  getPowerState(deviceId) {
    return this.getState(deviceId)
      .then((state) => {
        return state.power === POWER_ON_INTEGER;
      });
  }

  setPowerState(deviceId, value) {
    return new BluePromise((resolve, reject) => {
      console.log('setPowerState', value);
      const light = this.deviceState.getClientObjectIfReachable(deviceId);
      if (!light) {
        return reject(new Error('NOT_REACHABLE'));
      }
      if (value === true || value === 'true') {
        light.setMode(3);
      } else {
        light.setMode(0);
      }
      resolve();
    });
  }


  getStateForPolling(deviceId) {
    let deviceState;
    return this.getState(deviceId)
      .then((_deviceState) => {
        deviceState = _deviceState;
        return this.getAmbientLight(deviceId);
      })
      .then((ambientLightSensor) => {
        return {
          brightness: deviceState.color.brightness,
          power: deviceState.power === POWER_ON_INTEGER,
          ambientlight: ambientLightSensor
        };
      });
  }
}

module.exports = DreamscreenService;