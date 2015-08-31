require('styles');
var toolBox = require('toolbox');
var i18n = require('i18n');
var date = require('date');
var css = require('css-class-js');
var VscDatePicker = require('datepicker');

module.exports = (function () {

  return {
    init: function (opt) {

      this.options = opt || {
        lang: 'en'
      };

      // Langue par defaut si celle en option non prise en charge
      if (typeof i18n[this.options.lang] === 'undefined') {
        this.options.lang = 'en';
      }

      // If back date is not defined, set it to current date
      if (this.options.dateMin === undefined || this.options.dateMin === '') {
        this.options.dateMin = date.current();
      }

      // If next date is not defined, set it to empty value
      if (this.options.dateMax === undefined) {
        this.options.dateMax = '';
      }
    },
    wrap: function () {
      var args = Array.prototype.slice.call(arguments);
      var dpBuilder = this;
      // Browse datepickers fields to deal with specific behaviours
      if (args.length === 0) {
        return;
      }

      // Browse arguments
      var i = 0;
      for (i in args) {
        setOutInward(args[i]);
      }

      // Set outward / inward with {outward: '.selector'[, inward: '#selector']} object
      function setOutInward(outin) {
        if (typeof outin !== 'object') {
          return;
        }
        if (typeof outin.outward !== 'string') {
          return;
        }
        var outward = document.querySelector(outin.outward);
        if (outward === null) {
          return;
        }
        var inward = null;
        if (typeof outin.outward === 'string') {
          inward = document.querySelector(outin.inward);
        }
        var datepickers = [];
        datepickers.push({
          input: outward,
          dependingOnInput: null
        });
        if (inward !== null) {
          datepickers.push({
            input: inward,
            dependingOnInput: outward
          });
        }
        var i = 0;
        var l = 0;
        var input = null;
        var instanceOptions = {};
        for (i = 0, l = datepickers.length; i < l; i++) {
          input = datepickers[i].input;

          // On clone les options avant de les surcharger et les passer a la prochaine instance du datepicker
          toolBox.extendObject(instanceOptions, dpBuilder.options);
          toolBox.extendObject(instanceOptions, {dependingOnInput: datepickers[i].dependingOnInput});

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
          new VscDatePicker(input, instanceOptions);
        }
      }
    }
  };
})();
