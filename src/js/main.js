'use strict';

var datepicker = require('./datepicker.nojq.js');
module.exports = function () {
  return {
    init: function (lang, backDate, nextDate) {
      datepicker(lang, backDate, nextDate);
    }
  };
};