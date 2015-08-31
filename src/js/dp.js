require('styles');
var toolBox = require('toolbox');
var i18n = require('i18n');
var date = require('date');
var css = require('css-class-js');
var VscDatePicker = require('datepicker');

module.exports = (function () {

  var options = {
    lang: 'en',
    dateMin: date.current(),
    dateMax: ''
  };

  return {
    config: function (opt) {

      if (typeof opt === 'object') {
        options = opt;
      }

      // Langue par defaut si celle en option non prise en charge
      if (typeof i18n[options.lang] === 'undefined') {
        options.lang = 'en';
      }

      // If back date is not defined, set it to current date
      if (typeof options.dateMin !== 'string' || options.dateMin === '') {
        options.dateMin = date.current();
      }

      // If next date is not defined, set it to empty value
      if (typeof options.dateMax !== 'string') {
        options.dateMax = '';
      }
    },
    create: function (selector) {
      var dpBuilder = this;

      if (typeof selector !== 'string') {
        return;
      }

      var input = document.querySelector(selector);
      if (input === null) {
        return;
      }

      var instanceOptions = {};

      // On clone les options avant de les surcharger et les passer a la prochaine instance du datepicker
      toolBox.extendObject(instanceOptions, options);
      // Dependance vers un autre datepicker
      // toolBox.extendObject(instanceOptions, {dependingOnInput: datepickers[i].dependingOnInput});

      if (input.getAttribute('data-start-date')) {
        options.dateMin = date.start(input.getAttribute('data-start-date'));
      }
      // Railpass case
      if (css.hasClass(input, 'railpass-date')) {
        instanceOptions.dateMin = date.railpassMin();
      }
      // Backward case
      if (css.hasClass(input, 'datepicker-backwards')) {
        instanceOptions.dateMin = date.backward();
      }
      // Limit date range to 6 months in the future
      if (css.hasClass(input, 'six-months-in-future')) {
        instanceOptions.dateMax = date.sixMonthsFuture();
      }

      // Instantiate datepicker object
      return new VscDatePicker(input, instanceOptions);
    }
  };
})();
