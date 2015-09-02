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

  describe('Call date picker with default parameters', function () {
    describe('common behaviours', function () {
      var dp = require('../../src/js/dp');
      var datepicker;
      var today;
      var formattedToday;
      var todayCell;
      var todayRow;
      var formattedYesterday;
      var yesterdayCell;

      beforeEach(function () {
        datepicker = dp.create('.datepicker');
        today = moment();
        formattedToday = today.format('DD/MM/YYYY');
        todayCell = $('div.date-selector .today');
        todayRow = todayCell.parent();
        formattedYesterday = today.clone();
        formattedYesterday.subtract(1, 'days').format('DD/MM/YYYY');
        yesterdayCell = $('td[date="' + formattedYesterday + '"]');
      });

      it('should format today', function () {
        expect(todayCell.attr('date')).toBe(formattedToday);
      });

      it('should display current month in english', function () {
        var currentMonthName = moment().format('MMMM');
        var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
        expect(dpCurrentMonth).toBe(currentMonthName);
      });
    });

    it('should not create previous date cell when the 1st is a monday', function () {
      var clock = sinon.useFakeTimers(new Date('02/01/2016').getTime()); // February 1st

      var dp = require('../../src/js/dp');
      var datepicker = dp.create('.datepicker');
      var today = moment();
      var formattedToday = today.format('DD/MM/YYYY');
      var todayCell = $('td[date="' + formattedToday + '"]');
      var todayRow = todayCell.parent();
      var yesterday = today.clone();
      yesterday.subtract(1, 'days');
      var formattedYesterday = yesterday.format('DD/MM/YYYY');
      var yesterdayCell = $('td[date="' + formattedYesterday + '"]');

      // Today is at 0;0 position
      expect(todayCell.attr('id')).toBe('day0');
      expect(todayRow.attr('id')).toBe('row0');

      expect(yesterdayCell.length).toBe(0);

      clock.restore();
    });

    it('should not display previous date cell when it is not in the same month', function () {
      var clock = sinon.useFakeTimers(new Date('01/01/2016').getTime()); // January 1st

      var dp = require('../../src/js/dp');
      var datepicker = dp.create('.datepicker');
      var today = moment();
      var formattedToday = today.format('DD/MM/YYYY');
      var todayCell = $('td[date="' + formattedToday + '"]');
      var yesterday = today.clone();
      yesterday.subtract(1, 'days');
      var formattedYesterday = yesterday.format('DD/MM/YYYY');
      var yesterdayCell = $('td[date="' + formattedYesterday + '"]');

      // Today is the first day of the month
      expect(yesterdayCell.hasClass('unselected_month')).toBeTruthy();
      expect(yesterdayCell.hasClass('off_month')).toBeTruthy();

      clock.restore();
    });
    it('should disable previous date cell when it is in the same month', function () {
      var clock = sinon.useFakeTimers(new Date('01/02/2016').getTime()); // January 2nd

      var dp = require('../../src/js/dp');
      var datepicker = dp.create('.datepicker');
      var today = moment();
      var formattedToday = today.format('DD/MM/YYYY');
      var todayCell = $('td[date="' + formattedToday + '"]');
      var yesterday = today.clone();
      yesterday.subtract(1, 'days');
      var formattedYesterday = yesterday.format('DD/MM/YYYY');
      var yesterdayCell = $('td[date="' + formattedYesterday + '"]');

      expect(yesterdayCell.hasClass('unselected_month')).toBeTruthy();
      expect(yesterdayCell.hasClass('off_month')).toBeFalsy();

      clock.restore();
    });
  });

  it('should display \'Juillet\' for fr language', function () {
    var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());
    var lang = 'fr';
    var dp = require('../../src/js/dp');
    dp.config({lang: lang});
    dp.create('.datepicker');

    var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
    expect(dpCurrentMonth).toBe('Juillet');

    clock.restore();
  });

  it('should display \'Julio\' for es language', function () {
    var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());

    var lang = 'es';
    var dp = require('../../src/js/dp');
    dp.config({lang: lang});
    var datepicker = dp.create('.datepicker');

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

    var dp = require('../../src/js/dp');
    dp.config({
      lang: lang,
      dateMin: formattedDateMin,
      dateMax: formattedDateMax
    });
    var datepicker = dp.create('.datepicker');

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
