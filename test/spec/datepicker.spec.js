var moment = require('moment');
var $ = require('jquery');
var sinon = require('sinon');

describe('Date picker tests >', function () {

  var dp = require('../../src/js/dp');

  // Inject the HTML input for the tests
  beforeEach(function () {
    var datepickerInput = '<input type="text" class="datepicker">';
    document.body.insertAdjacentHTML('afterbegin', datepickerInput);
  });

  // Remove the html input and the date picker div from the DOM
  afterEach(function () {
    $('.datepicker').remove();
    $('.date-selector').remove();
  });

  describe('default parameters >', function () {
    describe('common behaviours >', function () {
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

      it('shoud disable previous month button', function () {
        var prevMonth = document.querySelector('.month-nav .prev');
        expect(prevMonth.className.indexOf('stop')).toBeGreaterThan(-1);
      });
    });

    it('should not create previous date cell when the 1st is a monday', function () {
      var clock = sinon.useFakeTimers(new Date('02/01/2016').getTime()); // February 1st

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

  describe('lang parameter >', function () {
    it('should display \'Juillet\' for fr language', function () {
      var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());

      var lang = 'fr';

      dp.config({lang: lang});
      dp.create('.datepicker');

      var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
      expect(dpCurrentMonth).toBe('Juillet');

      clock.restore();
    });

    it('should display \'Julio\' for es language', function () {
      var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());

      var lang = 'es';

      dp.config({lang: lang});
      dp.create('.datepicker');

      var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
      expect(dpCurrentMonth).toBe('Julio');

      clock.restore();
    });
  });

  describe('min and max dates parameters >', function () {
    var lang = 'fr';

    var mock = new Date('07/15/2015');
    var today = moment(mock);

    var dateMin = moment(mock).subtract(3, 'days');
    var formattedDateMin = dateMin.format('DD/MM/YYYY');
    var formattedOneDayBeforeMin = dateMin.clone().subtract(1, 'days').format('DD/MM/YYYY');
    var formattedFiveDaysBeforeMin = dateMin.clone().subtract(5, 'days').format('DD/MM/YYYY');

    var dateMax = moment(mock).add(3, 'days');
    var formattedDateMax = dateMax.format('DD/MM/YYYY');
    var formattedOneDayAfterMax = dateMax.clone().add(1, 'days').format('DD/MM/YYYY');
    var formattedFiveDaysAfterMax = dateMax.clone().add(5, 'days').format('DD/MM/YYYY');

    var dateMinCell;
    var oneDayBeforeCell;
    var fiveDaysBeforeCell;

    var dateMaxCell;
    var oneDayAfterCell;
    var fiveDaysAfterCell;

    var clock = sinon.useFakeTimers(mock.getTime());

    beforeEach(function () {
      dp.config({
        lang: lang,
        dateMin: dateMin.toDate(),
        dateMax: dateMax.toDate()
      });
      var datepicker = dp.create('.datepicker');

      dateMinCell = $('td[date="' + formattedDateMin + '"]');
      oneDayBeforeCell = $('.table-month-wrapper').find('[date="' + formattedOneDayBeforeMin + '"]');
      fiveDaysBeforeCell = $('.table-month-wrapper').find('[date="' + formattedFiveDaysBeforeMin + '"]');

      dateMaxCell = $('td[date="' + formattedDateMax + '"]');
      oneDayAfterCell = $('.table-month-wrapper').find('[date="' + formattedOneDayAfterMax + '"]');
      fiveDaysAfterCell = $('.table-month-wrapper').find('[date="' + formattedFiveDaysAfterMax + '"]');
    });

    describe('previous dates >', function () {
      it('should enable minDate cell', function () {
        expect(dateMinCell.hasClass('selectable_day')).toBeTruthy();
      });
      it('should disable day before cell', function () {
        expect(oneDayBeforeCell.hasClass('unselected_month')).toBeTruthy();
      });
      it('should enable 5 days before cell', function () {
        expect(fiveDaysBeforeCell.hasClass('unselected_month')).toBeTruthy();
      });
      it('should disable min date month prev', function () {
        dateMinCell.click();
        var prevMonth = document.querySelector('.month-nav .prev');
        expect(prevMonth.className.indexOf('stop')).toBeGreaterThan(-1);
      });
    });

    describe('next dates >', function () {
      it('should enable maxDate cell', function () {
        expect(dateMaxCell.hasClass('selectable_day')).toBeTruthy();
      });
      it('should disable day after cell', function () {
        expect(oneDayAfterCell.hasClass('unselected_month')).toBeTruthy();
      });
      it('should enable 5 days after cell', function () {
        expect(fiveDaysAfterCell.hasClass('unselected_month')).toBeTruthy();
      });
      it('should disable max date month next', function () {
        dateMaxCell.click();
        var nextMonth = document.querySelector('.month-nav .next');
        expect(nextMonth.className.indexOf('stop')).toBeGreaterThan(-1);
      });
    });

    clock.restore();
  });
});
