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

  it('Display date picker with back and next dates parameters', function () {
    var lang = 'fr';

    var backDate = moment().subtract(3, 'days').calendar();
    var nextDate = moment().subtract(3, 'days').calendar();
    require('../../src/js/datepicker').init({
      lang: lang,
      backDate: backDate,
      nextDate: nextDate
    });

    // Verify that previous date is unselected
    var backDateElement = $('.table-month-wrapper').find('[date="' + backDate + '"]');
    var previousElement = backDateElement.prev();
    expect(backDateElement.attr('class')).toBe('selectable_day');
    expect(previousElement.attr('class')).toBe('unselected_month');

    // Verify that next date is unselected
    var nextDateElement = $('.table-month-wrapper').find('[date="' + backDate + '"]');
    var nextElement = nextDateElement.next();
    expect(nextDateElement.attr('class')).toBe('selectable_day');
    expect(nextElement.attr('class')).toBe('unselected_month');
  });
});
