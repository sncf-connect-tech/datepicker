var sinon = require('sinon');
var dateObject = require('../../src/js/date');

describe('date.js', function () {
  describe('current method', function () {
    it('returns a string dd/mm/yyyy (case 1)', function () {
      var timestamp = (new Date (2016, 1, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var currentDate = dateObject.current();
      expect(currentDate).toEqual('15/02/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2)', function () {
      var timestamp = (new Date (2016, 1, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var currentDate = dateObject.current();
      expect(currentDate).toEqual('02/02/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3)', function () {
      var timestamp = (new Date (2016, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var currentDate = dateObject.current();
      expect(currentDate).toEqual('15/12/2016');
      clock.restore();
    });
  });
  describe('backward method', function () {
    it('returns a string dd/mm/yyyy (case 1, bissextile year)', function () {
      var timestamp = (new Date (2016, 2, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('16/12/2015');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2, bissextile year)', function () {
      var timestamp = (new Date (2016, 2, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('03/12/2015');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3, bissextile year)', function () {
      var timestamp = (new Date (2016, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('16/09/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 1, normal year)', function () {
      var timestamp = (new Date (2015, 2, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('15/12/2014');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2, normal year)', function () {
      var timestamp = (new Date (2015, 2, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('02/12/2014');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3, normal year)', function () {
      var timestamp = (new Date (2015, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var backwardDate = dateObject.backward();
      expect(backwardDate).toEqual('16/09/2015');
      clock.restore();
    });
  });
  describe('sixMonthsFuture method', function () {
    it('returns a string dd/mm/yyyy (case 1, bissextile year)', function () {
      var timestamp = (new Date (2016, 1, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('15/08/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2, bissextile year)', function () {
      var timestamp = (new Date (2016, 1, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('02/08/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3, bissextile year)', function () {
      var timestamp = (new Date (2016, 3, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('15/10/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 1, normal year)', function () {
      var timestamp = (new Date (2015, 1, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('15/08/2015');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2, normal year)', function () {
      var timestamp = (new Date (2015, 1, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('02/08/2015');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3, normal year)', function () {
      var timestamp = (new Date (2015, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var sixMonthDate = dateObject.sixMonthsFuture();
      expect(sixMonthDate).toEqual('15/06/2016');
      clock.restore();
    });
  });
  describe('railpassMin method', function () {
    it('returns a string dd/mm/yyyy (case 1)', function () {
      var timestamp = (new Date (2016, 1, 28)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var railpassMin = dateObject.railpassMin();
      expect(railpassMin).toEqual('06/03/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2)', function () {
      var timestamp = (new Date (2016, 1, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var railpassMin = dateObject.railpassMin();
      expect(railpassMin).toEqual('22/02/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3)', function () {
      var timestamp = (new Date (2016, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var railpassMin = dateObject.railpassMin();
      expect(railpassMin).toEqual('22/12/2016');
      clock.restore();
    });
  });
  describe('start method', function () {
    it('returns a string dd/mm/yyyy (case 1)', function () {
      var timestamp = (new Date (2016, 1, 28)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var start = dateObject.start(0);
      expect(start).toEqual('29/02/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 2)', function () {
      var timestamp = (new Date (2016, 1, 2)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var start = dateObject.start(0);
      expect(start).toEqual('03/02/2016');
      clock.restore();
    });
    it('returns a string dd/mm/yyyy (case 3)', function () {
      var timestamp = (new Date (2016, 11, 15)).getTime();
      var clock = sinon.useFakeTimers(timestamp);
      var start = dateObject.start(0);
      expect(start).toEqual('16/12/2016');
      clock.restore();
    });
  });
});