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
        monthNames: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
        shortMonthNames: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        shortDayNames: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        todayString: 'Aujourd\'hui',
        errorOutOfRange: "La date sélectionnée est incorrecte",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Précédent",
        next: "Suivant"
      };
      break;

    case 'de':
      options = {
        monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        shortDayNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        todayString: 'Heute',
        errorOutOfRange: "Das selektierte Datum ist ungültig.",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Früher",
        next: "Nächste"
      };
      break;

    case 'it':
      options = {
        monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        shortMonthNames: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        dayNames: ['Domenica', 'Luned&#236', 'Marted&#236', 'Mercoled&#236', 'Gioved&#236', 'Venerd&#236', 'Sabato'],
        shortDayNames: ['Do', 'Lu', 'Ma', 'Me', 'Gio', 'Ve', 'Sa'],
        todayString: 'Oggi',
        errorOutOfRange: "La data selezionata non è disponibile",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Precedente",
        next: "Il prossimo"
      };
      break;

    case 'es':
      options = {
        monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        shortMonthNames: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado'],
        shortDayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;'],
        todayString: 'Hoy',
        errorOutOfRange: "La fecha seleccionada est&aacute; fuera de rango",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Anterior",
        next: "Siguiente"
      };
      break;

    case 'nl':
      options = {
        monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        shortMonthNames: ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
        dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
        shortDayNames: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
        todayString: 'Vandaag',
        errorOutOfRange: "De geselecteerde datum is niet beschikbaar",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Vorig",
        next: "Volgende"
      };
      break;

    default:
      options = {
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        todayString: 'Today',
        errorOutOfRange: "Selected date is out of range",
        dateFormat: "dd/mm/YYYY",
        dateMin: backDate,
        dateMax: nextDate,
        previous: "Previous",
        next: "Next"
      };
      break;
  }

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
    require("./jquery.jdpicker.nojq.js")(input, options);

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
