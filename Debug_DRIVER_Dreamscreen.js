"use strict";

const neeoapi = require("neeo-sdk");
const driver = require("./devices/dreamscreen/index");

const SK = driver.buildSK();
const HD4K = driver.buildHD4K();

neeoapi
  .startServer({
    brain: "10.2.1.64",
    port: 63362,
    name: "DreamscreenDriver",
    devices: [SK, HD4K]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "Dreamscreen".');
  })
  .catch(err => {
    console.error("ERROR!", err);
    process.exit(1);
  });
