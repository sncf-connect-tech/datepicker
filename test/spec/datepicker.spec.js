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

  describe('invalid parameters >', function () {
    describe('common behaviours >', function () {
      it('should do nothing', function () {
        dp.create('.without-parameters');
      });
    });
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

      it('should disable previous month button', function () {
        var prevMonth = document.querySelector('.month-nav .prev');
        expect(prevMonth.className.indexOf('stop')).toBeGreaterThan(-1);
      });

      it('should display the next month when `next button` is clicked', function () {
        var dpCurrentMonth;

        expect($('.date-selector .month-name')[0].textContent).toBe(moment().format('MMMM'));

        $('.button.next').click();

        expect($('.date-selector .month-name')[0].textContent).toBe(moment().add(1, 'month').format('MMMM'));
      });

      it('should display the prev month when `prev button` is clicked', function () {
        $('.button.next').click();

        expect($('.date-selector .month-name')[0].textContent).toBe(moment().add(1, 'month').format('MMMM'));

        $('.button.prev').click();

        expect($('.date-selector .month-name')[0].textContent).toBe(moment().format('MMMM'));
      });

      it('should do nothing when lightbox `click`', function () {
        $('.date-selector').click();
      });

      it('should hide if `click` outside', function () {
        expect($('.date-selector[aria-hidden="true"]').size()).toBe(1);

        datepicker.show();

        expect($('.date-selector[aria-hidden="true"]').size()).toBe(0);
        $(document.body).click();

        expect($('.date-selector[aria-hidden="true"]').size()).toBe(1);
      });

      it('should set date min', function () {
        datepicker.setDateMin(moment().subtract(1, 'month').toDate());
      });

      it('should set date max', function () {
        datepicker.setDateMax(moment().add(3, 'month').toDate());
      });

      it('should show it-self', function () {
        datepicker.show();
      });

      it('should set the number of calendar', function () {
        datepicker.setNbCalendar(5);

        expect($('.month-head').size()).toBe(5);
      });

      it('should do nothing when getMonthSelect', function () {
        datepicker.getMonthSelect();
      });

      it('should return number of week when getWeekNum', function () {
        expect(datepicker.getWeekNum(new Date('Wed Dec 07 2016 15:35:00 GMT+0100'))).toBe(50);
      });

      it('should works when moveDateMonthBy', function () {
        datepicker.moveDateMonthBy(3);

        expect($('.date-selector .month-name')[0].textContent).toBe(moment().add(3, 'month').format('MMMM'));
      });

      describe('keyboard > ', function () {

        it('Tab key (9)', function () {
          datepicker.keydownHandler({ keyCode: 9, preventDefault: function () {} });
        });

        it('Ctrl key (27)', function () {
          datepicker.keydownHandler({ keyCode: 27, preventDefault: function () {} });
        });

        it('Enter key (13)', function () {
          datepicker.keydownHandler({ keyCode: 13, preventDefault: function () {} });
        });

        it('Enter key (33)', function () {
          datepicker.keydownHandler({ keyCode: 33, preventDefault: function () {} });
        });

        it('Enter key (34)', function () {
          datepicker.keydownHandler({ keyCode: 34, preventDefault: function () {} });
        });

        it('Enter key (38)', function () {
          datepicker.keydownHandler({ keyCode: 38, preventDefault: function () {} });
        });

        it('Enter key (40)', function () {
          datepicker.keydownHandler({ keyCode: 40, preventDefault: function () {} });
        });

        it('Enter key (37)', function () {
          datepicker.keydownHandler({ keyCode: 37, preventDefault: function () {} });
        });

        it('Enter key (39)', function () {
          datepicker.keydownHandler({ keyCode: 39, preventDefault: function () {} });
        });
      });

      describe('setDateFormat() > ', function () {
        it('format: `default`', function () {
          datepicker.dateFormat = 'default';
          datepicker.setDateFormat();
        });

        it('format: `FF dd YYYY`', function () {
          datepicker.dateFormat = 'FF dd YYYY';
          datepicker.setDateFormat();
        });

        it('format: `dd MM YYYY`', function () {
          datepicker.dateFormat = 'dd MM YYYY';
          datepicker.setDateFormat();
        });

        it('format: `MM dd YYYY`', function () {
          datepicker.dateFormat = 'MM dd YYYY';
          datepicker.setDateFormat();
        });

        it('format: `dd FF YYYY`', function () {
          datepicker.dateFormat = 'dd FF YYYY';
          datepicker.setDateFormat();
        });
      });
    });

    it('should be create with element', function () {
      dp.create(document.querySelector('.datepicker'));
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
      expect(todayCell.index()).toBe(0);
      expect(todayRow.index()).toBe(1);

      expect(yesterdayCell.length).toBe(0);

      clock.restore();
    });

    it('should display August after move date August 31 by 1 day and back by a month', function () {
      var clock = sinon.useFakeTimers(new Date('08/31/2016').getTime()); // August 31

      var datepicker = dp.create('.datepicker');

      datepicker.moveDateBy(1);
      expect($('div.date-selector .month-name-0').text()).toBe('September');

      datepicker.moveMonthBy(-1);
      expect($('div.date-selector .month-name-0').text()).toBe('August');

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
    it('should display \'July\' for undefined language', function () {
      var clock = sinon.useFakeTimers(new Date('07/15/2015').getTime());

      dp.config();
      dp.create('.datepicker');

      var dpCurrentMonth = $('.date-selector .month-name')[0].textContent;
      expect(dpCurrentMonth).toBe('July');

      clock.restore();
    });

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
