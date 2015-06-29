'use strict';

module.exports = function (lang, backDate, nextDate) {

  /**
   * Return the current date
   */
  function currentDate() {
    var today = new Date(),
      dd = today.getDate(),
      mm = today.getMonth() + 1,
      yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return String(dd + "\/" + mm + "\/" + yyyy);
  }

  function backwardDate() {
    var THIRTY_DAYS = 90 * 24 * 60 * 60 * 1000,
      thirtyDaysFromNow = new Date(new Date() - THIRTY_DAYS),
      dd = thirtyDaysFromNow.getDate(),
      mm = thirtyDaysFromNow.getMonth() + 1,
      yyyy = thirtyDaysFromNow.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    return String(dd + "\/" + mm + "\/" + yyyy);
  }

  // For UK Railpass
  function railpassMinDate() {
    var allowedDate = new Date();

    allowedDate.setDate(allowedDate.getDate() + 7);

    var dd = allowedDate.getDate(),
      mm = allowedDate.getMonth() + 1,
      yyyy = allowedDate.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return String(dd + "\/" + mm + "\/" + yyyy);
  }

  // For start date
  function startDate(days) {
    var today = new Date(),
      dd = today.getDate() + parseInt(days) + 1,
      mm = today.getMonth() + 1,
      yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return String(dd + "\/" + mm + "\/" + yyyy);
  }

  // For 6 months limitation
  function sixMonthsFutureDate() {
    var allowedDate = new Date();

    allowedDate.setMonth(allowedDate.getMonth() + 6);

    var dd = allowedDate.getDate(),
      mm = allowedDate.getMonth() + 1,
      yyyy = allowedDate.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return String(dd + "\/" + mm + "\/" + yyyy);
  }

  //if back date is not defined, set it to current date
  if (backDate === undefined || backDate ==='') {
    backDate = currentDate();
  }

  //if next date is not defined, set it to empty value
  if (nextDate === undefined) {
    nextDate = '';
  }

  var options = {
    lang: typeof lang === "undefined" ? "en" : lang,
    dateMin: backDate,
    dateMax: nextDate
  };



  // Browse datepickers fields to deal with specific behaviours
  var datepickers = document.querySelectorAll('input.datepicker'),
      i = 0,
      l = 0,
      input = null;
  for (i = 0, l = datepickers.length; i < l; i++) {
    input = datepickers[i];
    if (input.getAttribute('data-start-date')) {
      options.dateMin = startDate(input.getAttribute('data-start-date'));
    }
    // Railpass case
    if (input.classList.contains('railpass-date')) {
      options.dateMin = railpassMinDate();
    }
    // Backward case
    if (input.classList.contains('datepicker-backwards')) {
      options.dateMin = backwardDate();
    }
    // Limit date range to 6 months in the future
    if (input.classList.contains('six-months-in-future')) {
      options.dateMax = sixMonthsFutureDate();
    }
    // Instantiate datepicker object
    require("jdpicker")(input, options);

    // Restore default values
    if (input.classList.contains('railpass-date') || input.getAttribute('data-start-date')) {
      options.dateMin = '';
    }
    if (input.classList.contains('datepicker-backwards')) {
      options.dateMin = currentDate();
    }
    if (input.classList.contains('six-months-in-future')) {
      options.dateMax = nextDate;
    }
  }
};
