var moment = require('moment');
var $ = require('jquery');
var sinon = require('sinon');

describe('Date picker tests', function () {

  var currentDate;
  // Inject the HTML input for the tests
  beforeEach(function () {
    currentDate = new Date();
    var datepickerInput = '<input type="text" class="datepicker">';
    document.body.insertAdjacentHTML('afterbegin', datepickerInput);
  });

  // Remove the html input and the date picker div from the DOM
  afterEach(function () {
    $('.datepicker').remove();
    $('.date-selector').remove();
  });

  it('Call date picker with default parameters', function () {
    var DatePicker = require('../../src/js/datepicker');
    DatePicker.init();
    DatePicker.wrap({outward: '.datepicker'});

    // Verify today
    var formattedToday = moment().format('DD/MM/YYYY');
    var dpToday = $('div.date-selector .today').attr('date');
    expect(dpToday).toBe(formattedToday);

    // Verify month name is in english
    var currentMonthName = moment().format('MMMM');
    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe(currentMonthName);

    // Verify that previous date is unselected
    var previousParentId = $('div.date-selector .today').parent().prev().attr('id');
    var lastElement = $('#' + previousParentId + ' td:last-child');
    expect(lastElement.attr('class')).toBe('unselected_month');
  });

  it('Display date picker for fr language', function () {
    var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());
    var lang = 'fr';
    var DatePicker = require('../../src/js/datepicker');
    DatePicker.init({lang: lang});
    DatePicker.wrap({outward: '.datepicker'});

    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe('Juillet');

    clock.restore();
  });

  it('Display date picker for es language', function () {
    var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());
    var lang = 'es';
    var DatePicker = require('../../src/js/datepicker');
    DatePicker.init({lang: lang});
    DatePicker.wrap({outward: '.datepicker'});

    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe('Julio');

    clock.restore();
  });

  it('Display date picker with min and max dates parameters', function () {
    var lang = 'fr';

    var dateMin = moment().subtract(3, 'days');
    var formattedDateMin = dateMin.format('DD/MM/YYYY');
    var formattedOneDayBeforeDateMin = dateMin.subtract(1, 'days').format('DD/MM/YYYY');
    var dateMax = moment().add(3, 'days');
    var formattedDateMax = dateMax.format('DD/MM/YYYY');
    var formattedOneDayAfterMaxDate = dateMax.add(1, 'days').format('DD/MM/YYYY');

    var DatePicker = require('../../src/js/datepicker');
    DatePicker.init({
      lang: lang,
      dateMin: formattedDateMin,
      dateMax: formattedDateMax
    });
    DatePicker.wrap({outward: '.datepicker'});

    // Verify that previous date is unselected
    var dateMinElement = $('.table-month-wrapper').find('[date="' + formattedDateMin + '"]');
    var oneDayBeforeDateMinElement = $('.table-month-wrapper').find('[date="' + formattedOneDayBeforeDateMin + '"]');
    expect(dateMinElement.attr('class')).toBe('selectable_day');
    expect(oneDayBeforeDateMinElement.attr('class')).toBe('unselected_month');

    // Verify that next date is unselected
    var dateMaxElement = $('.table-month-wrapper').find('[date="' + formattedDateMax + '"]');
    var oneDayAfterDateMaxElement = $('.table-month-wrapper').find('[date="' + formattedOneDayAfterMaxDate + '"]');
    expect(dateMaxElement.attr('class')).toBe('selectable_day');
    expect(oneDayAfterDateMaxElement.attr('class')).toBe('unselected_month');
  });
});
