'use strict';
var log4js = require('log4js');

log4js.configure({
  appenders: {
    protractorLogs: {
      type: 'file',
      filename: 'protractor.log'
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    protractor: {
      appenders: ['protractorLogs'],
      level: 'error'
    },
    another: {
      appenders: ['console'],
      level: 'trace'
    },
    default: {
      appenders: ['console', 'protractorLogs'],
      level: 'trace'
    }
  }
});

module.exports = {
  log: function (text) {
    var logger = log4js.getLogger();
    logger.trace(text);
  }
}