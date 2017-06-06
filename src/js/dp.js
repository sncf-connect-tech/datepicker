require('styles');
var toolBox = require('toolbox');
var i18n = require('i18n');
var date = require('date');
var VscDatePicker = require('datepicker');

module.exports = (function () {

  var options = {};

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
      if (typeof options.dateMin === 'undefined' || !(options.dateMin instanceof Date)) {
        options.dateMin = new Date();
      }

      // If next date is not defined, set it to empty value
      if (typeof options.dateMax === 'undefined' || !(options.dateMax instanceof Date)) {
        options.dateMax = null;
      }

      if (!options.hasOwnProperty('nbCalendar')) {
        options.nbCalendar = 'auto';
      }
    },
    create: function (selector) {
      var dpBuilder = this;

      var input;

      if (typeof selector === 'string') {
        input = document.querySelector(selector);
      } else if (selector.nodeType && (selector.nodeType === document.ELEMENT_NODE)) {
        input = selector;
      }

      if (!input) {
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
      if (input.classList.contains('railpass-date')) {
        instanceOptions.dateMin = date.railpassMin();
      }
      // Backward case
      if (input.classList.contains('datepicker-backwards')) {
        instanceOptions.dateMin = date.backward();
      }
      // Limit date range to 6 months in the future
      if (input.classList.contains('six-months-in-future')) {
        instanceOptions.dateMax = date.sixMonthsFuture();
      }

      if (instanceOptions.nbCalendar === 'auto') {
        var innerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        instanceOptions.nbCalendar = 2;
        if (innerWidth < 500) {
          instanceOptions.nbCalendar = 1;
        }
      }

      // Instantiate datepicker object
      return new VscDatePicker(input, instanceOptions);
    }
  };
})();
