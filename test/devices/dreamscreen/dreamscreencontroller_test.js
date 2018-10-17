"use strict";

const expect = require("chai").expect;
const mockery = require("mockery");
const sinon = require("sinon");
const requireHelper = require("../../require_helper.js");

describe("./devices/dreamscreen/dreamscreencontroller.js", function() {
  const sandbox = sinon.sandbox.create();
  let dreamscreenController;
  let deviceId, value;

  beforeEach(function() {
    mockery.enable({ warnOnReplace: true, warnOnUnregistered: false, useCleanCache: true });
    deviceId = undefined;
    value = undefined;

    class dreamscreenServiceMock {
      setBrightness(_deviceId, _value) {
        deviceId = _deviceId;
        value = _value;
        return Promise.resolve();
      }
      getBrightness(_deviceId) {
        deviceId = _deviceId;
        return Promise.resolve(value);
      }

      setPowerState(_deviceId, _value) {
        deviceId = _deviceId;
        value = _value;
        return Promise.resolve();
      }
      getPowerState(_deviceId) {
        deviceId = _deviceId;
        return Promise.resolve(value);
      }

      /* getAmbientLight(_deviceId) {
        deviceId = _deviceId;
        return Promise.resolve(value);
      } */

      getAllDevices() {
        return Promise.resolve(value);
      }

      powerToggle(_deviceId) {
        deviceId = _deviceId;
        return Promise.resolve("TOGGLE");
      }

      showAlert(_deviceId) {
        deviceId = _deviceId;
        return Promise.resolve("ALERT");
      }
    }

    mockery.registerMock("./lifxservice", dreamscreenServiceMock);

    dreamscreenController = requireHelper("devices/dreamscreen/dreamscreenController");
    dreamscreenController.initialise();
  });

  afterEach(function() {
    sandbox.restore();
    mockery.deregisterAll();
    mockery.disable();
  });

  it("should not double initialise controller", function() {
    const result = dreamscreenController.initialise();
    expect(result).to.equal(false);
  });

  

  it("should set brightness", function() {
    const DEVICEID = "D00D6336";
    const VALUE = 55;
    return dreamscreenController.brightnessSliderCallback.setter(DEVICEID, VALUE).then(() => {
      expect(deviceId).to.equal(DEVICEID);
      expect(value).to.equal(VALUE);
    });
  });

  it("should get brightness", function() {
    const DEVICEID = "D00D6336";
    const VALUE = 55;
    value = VALUE;
    return dreamscreenController.brightnessSliderCallback.getter(DEVICEID).then(result => {
      expect(deviceId).to.equal(DEVICEID);
      expect(result).to.equal(VALUE);
    });
  });

  it("should set poweroff device", function() {
    const DEVICEID = "D00D6336";
    const VALUE = false;
    return dreamscreenController.powerSwitchCallback.setter(DEVICEID, VALUE).then(() => {
      expect(deviceId).to.equal(DEVICEID);
      expect(value).to.equal(VALUE);
    });
  });

  it("should get power state", function() {
    const DEVICEID = "D00D6336";
    const VALUE = true;
    value = VALUE;
    return dreamscreenController.powerSwitchCallback.getter(DEVICEID).then(result => {
      expect(deviceId).to.equal(DEVICEID);
      expect(result).to.equal(VALUE);
    });
  });

  it("should power on via button", function() {
    const DEVICEID = "D00D6336";
    return dreamscreenController.onButtonPressed("POWER ON", DEVICEID).then(() => {
      expect(deviceId).to.equal(DEVICEID);
      expect(value).to.equal(true);
    });
  });

  it("should power off via button", function() {
    const DEVICEID = "D00D6336";
    return dreamscreenController.onButtonPressed("POWER OFF", DEVICEID).then(() => {
      expect(deviceId).to.equal(DEVICEID);
      expect(value).to.equal(false);
    });
  });

  it("should power toggle via button", function() {
    const DEVICEID = "D00D6336";
    return dreamscreenController.onButtonPressed("POWER_TOGGLE", DEVICEID).then(result => {
      expect(deviceId).to.equal(DEVICEID);
      expect(result).to.equal("TOGGLE");
    });
  });

  it("should alert via button", function() {
    const DEVICEID = "D00D6336";
    return dreamscreenController.onButtonPressed("ALERT", DEVICEID).then(result => {
      expect(deviceId).to.equal(DEVICEID);
      expect(result).to.equal("ALERT");
    });
  });

  it("should ignore invalid button event", function() {
    const DEVICEID = "D00D6336";
    return dreamscreenController.onButtonPressed("FOO", DEVICEID).then(result => {
      expect(result).to.equal(false);
    });
  });

  it("should get ambient light sensor", function() {
    const DEVICEID = "D00D6336";
    const VALUE = true;
    value = VALUE;
    return dreamscreenController.ambientLightSensorCallback.getter(DEVICEID).then(result => {
      expect(deviceId).to.equal(DEVICEID);
      expect(result).to.equal(VALUE);
    });
  });
});
