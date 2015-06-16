'use strict';

var $ = require('jquery');

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

  var options = {};

  //if back date is not defined, set it to current date
  if (backDate === undefined || backDate ==='') {
    backDate = currentDate();
  }

  //if next date is not defined, set it to empty value
  if (nextDate === undefined) {
    nextDate = '';
  }

  switch (lang) {
    case 'fr':
      options = {
        month_names: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
        short_month_names: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"],
        day_names: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        short_day_names: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        today_string: 'Aujourd\'hui',
        error_out_of_range: "La date sélectionnée est incorrecte",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Précédent",
        next: "Suivant"
      };
      break;

    case 'de':
      options = {
        month_names: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        short_month_names: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        day_names: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        short_day_names: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        today_string: 'Heute',
        error_out_of_range: "Das selektierte Datum ist ungültig.",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Früher",
        next: "Nächste"
      };
      break;

    case 'it':
      options = {
        month_names: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        short_month_names: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        day_names: ['Domenica', 'Luned&#236', 'Marted&#236', 'Mercoled&#236', 'Gioved&#236', 'Venerd&#236', 'Sabato'],
        short_day_names: ['Do', 'Lu', 'Ma', 'Me', 'Gio', 'Ve', 'Sa'],
        today_string: 'Oggi',
        error_out_of_range: "La data selezionata non è disponibile",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Precedente",
        next: "Il prossimo"
      };
      break;

    case 'es':
      options = {
        month_names: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        short_month_names: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        day_names: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
        short_day_names: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],
        today_string: 'Hoy',
        error_out_of_range: "La fecha seleccionada est&aacute; fuera de rango",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Anterior",
        next: "Siguiente"
      };
      break;

    case 'nl':
      options = {
        month_names: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        short_month_names: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
        day_names: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        short_day_names: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        today_string: 'Vandaag',
        error_out_of_range: "De geselecteerde datum is niet beschikbaar",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Vorig",
        next: "Volgende"
      };
      break;

    default:
      options = {
        month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        short_day_names: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        today_string: 'Today',
        error_out_of_range: "Selected date is out of range",
        date_format: "dd/mm/YYYY",
        date_min: backDate,
        date_max: nextDate,
        previous: "Previous",
        next: "Next"
      };
      break;
  }

  // Browse datepickers fields to deal with specific behaviours
  $('input.datepicker').each(function () {
    if ($(this).attr('data-start-date')) {
      options.date_min = startDate($(this).attr('data-start-date'));
    }
    // Railpass case
    if ($(this).hasClass('railpass-date')) {
      options.date_min = railpassMinDate();
    }
    // Backward case
    if ($(this).hasClass('datepicker-backwards')) {
      options.date_min = backwardDate();
    }
    // Limit date range to 6 months in the future
    if ($(this).hasClass('six-months-in-future')) {
      options.date_max = sixMonthsFutureDate();
    }
    // Instantiate datepicker object
    require("./jquery.jdpicker.js")($(this), options);

    // Restore default values
    if ($(this).hasClass('railpass-date') || $(this).attr('data-start-date')) {
      options.date_min = '';
    }
    if ($(this).hasClass('datepicker-backwards')) {
      options.date_min = currentDate();
    }
    if ($(this).hasClass('six-months-in-future')) {
      options.date_max = nextDate;
    }
  });
};
