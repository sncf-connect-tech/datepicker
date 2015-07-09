var moment = require('moment');
var $ = require('jquery');

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
    require('../../src/js/datepicker').init();

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
    var lang = 'fr';
    require('../../src/js/datepicker').init({lang: lang});

    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe('Juillet');
  });

  it('Display date picker for es language', function () {
    var lang = 'es';
    require('../../src/js/datepicker').init({lang: lang});

    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe('Julio');
  });

  it('Display date picker with min and max dates parameters', function () {
    var lang = 'fr';

    var dateMin = moment().subtract(3, 'days');
    var formattedDateMin = dateMin.format('DD/MM/YYYY');
    var formattedOneDayBeforeDateMin = dateMin.subtract(1, 'days').format('DD/MM/YYYY');
    var dateMax = moment().add(3, 'days');
    var formattedDateMax = dateMax.format('DD/MM/YYYY');
    var formattedOneDayAfterMaxDate = dateMax.add(1, 'days').format('DD/MM/YYYY');

    require('../../src/js/datepicker').init({
      lang: lang,
      dateMin: formattedDateMin,
      dateMax: formattedDateMax
    });

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
