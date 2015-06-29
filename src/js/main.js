'use strict';

var datepicker = require('datepicker');
module.exports = function () {
  return {
    init: function (lang, backDate, nextDate) {
      datepicker(lang, backDate, nextDate);
    }
  };
};
