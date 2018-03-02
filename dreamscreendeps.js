'use strict';

const DreamscreenClient = require('dreamscreen-node').Client;

function buildDreamscreenClientInstance() {
  return new DreamscreenClient();
}

module.exports = {
  buildDreamscreenClientInstance
};