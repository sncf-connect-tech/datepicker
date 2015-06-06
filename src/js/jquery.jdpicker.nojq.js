/**
 jdPicker 1.0
 Requires jQuery version: >= 1.2.6

 2010 - ? -- Paul Da Silva, AMJ Groupe

 Copyright (c) 2007-2008 Jonathan Leighton & Torchbox Ltd

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

module.exports = (function () {

  Object.prototype.extend = function (obj) {
    var i = '';
    for (i in obj) {
      this[i] = obj[i];
    }
    return this;
  };

  Node.prototype.empty = function () {
    while (this.hasChildNodes()) {
      this.removeChild(this.lastChild);
    }
    return this;
  };

  function createElement(str) {
    var elt = document.createElement("div");
    elt.innerHTML = str;
    return elt.firstChild;
  }

  /**
   * Constructor
   */
  function jdPicker(el, opts) {
    /* jshint validthis: true */
    if (typeof (opts) !== "object") {
      opts = {};
    }
    this.extend(jdPicker.DEFAULT_OPTS).extend(opts);

    this.input = el;
    this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");

    this.build();
    this.selectDate();
    this.hide();
  }

  /**
   * Default options
   * @type {Object}
   */
    //JdPicker i18n
  jdPicker.DEFAULT_OPTS = {
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    todayString: 'Today',
    errorOutOfRange: "Selected date is out of range",
    selectableDays: [0, 1, 2, 3, 4, 5, 6],
    nonSelectable: [],
    recNonSelectable: [],
    startOfWeek: 1,
    showWeek: 0,
    selectWeek: 0,
    weekLabel: "",
    nbCalendar: 2,
    dateMin: "",
    dateMax: "",
    dateFormat: "dd/mm/YYYY",
    previous: "Previous",
    next: "Next"
  };

  jdPicker.prototype = {
    build: build,
    presetInward: presetInward,
    renderDatepicker: renderDatepicker,
    clickEvent: clickEvent,
    selectMonth: selectMonth,
    selectDate: selectDate,
    isNewDateAllowed: isNewDateAllowed,
    isHoliday: isHoliday,
    changeInput: changeInput,
    show: show,
    hide: hide,
    hideIfClickOutside: hideIfClickOutside,
    keydownHandler: keydownHandler,
    currentDate: currentDate,
    setDateFormat: setDateFormat,
    stringToDate: stringToDate,
    dateToString: dateToString,
    dateToShortString: dateToShortString,
    setPosition: setPosition,
    moveDateBy: moveDateBy,
    moveDateMonthBy: moveDateMonthBy,
    moveMonthBy: moveMonthBy,
    firstMonthAllowed: firstMonthAllowed,
    monthName: monthName,
    getMonthSelect: getMonthSelect,
    bindToObj: bindToObj,
    bindMethodsToObj: bindMethodsToObj,
    indexFor: indexFor,
    monthNum: monthNum,
    shortMonthNum: shortMonthNum,
    shortDayNum: shortDayNum,
    daysBetween: daysBetween,
    changeDayTo: changeDayTo,
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    isFirstDayOfWeek: isFirstDayOfWeek,
    getWeekNum: getWeekNum,
    isLastDayOfWeek: isLastDayOfWeek,
    showError: showError,
    adjustDays: adjustDays,
    strpad: strpad
  };

  function build() {
    /* jshint validthis: true */
    var self = this,
        i = 0,
        l = 0;

    this.wrapp = createElement('<div class="datepicker-wrapper">');
    this.input.parentNode.insertBefore(this.wrapp, this.input);
    this.wrapp.appendChild(this.input);

    this.setDateFormat();

    if (this.dateMax !== "" && this.dateMax.match(this.reg)) {
      this.dateMax = this.dateDecode(this.dateMax.match(this.reg));
    }
    else {
      this.dateMax = "";
    }

    if (this.dateMin !== "" && this.dateMin.match(this.reg)) {
      this.dateMin = this.dateDecode(this.dateMin.match(this.reg));
    }
    else {
      this.dateMin = "";
    }

    var monthHead = document.createElement('div'),
        monthHeading = null;
    this.monthNameSpan = [];
    this.yearNameSpan = [];

    for (i = 0; i < this.nbCalendar; i++) {
      monthHeading = createElement('<span role="heading" aria-atomic="true" aria-live="assertive" class="month-head month-head-' + i + '"></span> ');
      this.monthNameSpan.push(createElement('<span class="month-name month-name-' + i + '"></span> '));
      this.yearNameSpan.push(createElement('<span class="year-name year-name-' + i + '"></span>'));
      monthHeading.appendChild(this.monthNameSpan[i]);
      monthHeading.appendChild(createElement('<span> </span>'));
      monthHeading.appendChild(this.yearNameSpan[i]);
      monthHead.appendChild(monthHeading);
    }

    // Nav buttons
    var monthNav = createElement('<p class="month-nav">' + '<span class="button prev idp-left" title="' + this.previous + ' [Page-Up]" role="button">' + this.previous + '</span>' + '<span class="button next idp-right" title="' + this.next + ' [Page-Down]" role="button">' + this.next + '</span></p>');
    monthNav.appendChild(monthHead);

    this.prevBtn = monthNav.querySelector('.prev');
    this.nextBtn = monthNav.querySelector('.next');

    this.prevBtn.onclick = this.bindToObj(function (e) {
      this.moveMonthBy(Number('-1')); // Always go 1 month backward, even if 2 months or more are displayed
      e.preventDefault();
      e.stopPropagation();
      var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), -1);
      this.firstMonthAllowed(newMonth);
    });

    this.nextBtn.onclick = this.bindToObj(function (e) {
      this.moveMonthBy(1); // Always go 1 month forward, even if 2 months or more are displayed
      e.preventDefault();
      e.stopPropagation();
    });

    nav.appendChild(this.errorMsg);
    nav.appendChild(monthNav);

    if (this.showWeek === 1) {
      tableShell += '<th class="weekLabel">' + (this.weekLabel) + '</th>';
    }

    tableShell += "</tr></thead><tbody><tr><td></td></tr></tbody></table>";
    tableShell = createElement(tableShell);

    var todayDate = createElement('<div class="today-date" role="button">' + this.todayString + '</div>'),
      style = (this.input.type === "hidden") ? ' style="display:block; position:static; margin:0 auto"' : '';

    this.dateSelector = createElement('<div class="date-selector" aria-hidden="true"' + style + '></div>');
    this.dateSelector.appendChild(nav);
    this.dateSelector.appendChild(tableShell);
    this.dateSelector.appendChild(todayDate);
    this.input.parentNode.appendChild(this.dateSelector);  
    this.rootLayers = this.dateSelector;

    todayDate.click = this.bindToObj(function () {
      this.changeInput(jdPicker.currentDate());
    });

    this.tbody = this.dateSelector.querySelector('tbody tr');
    // Fill inwardDate with outwardDate
    this.presetInward();

    this.input.onchange = (this.bindToObj(function () {
      this.selectDate();
    }));
    this.selectDate();
  }

  function presetInward() {
    /* jshint validthis: true */
    var dp = this;

    if (!dp.input.classList.contains('inward')) {
      return;
    }

    var parentForm = dp.input.parentNode,
        outward = null,
        outwardDate = [],
        inwardDate = [],
        month = '',
        day = '';

    while (parentForm.parentNode !== null && parentForm.tagName !== 'FORM') {
      parentForm = parentForm.parentNode;
    }
    if (parentForm !== null) {
      outward = parentForm.querySelector('input.outward');
    }

    dp.input.addEventListener('focus', inputFocusHandler);

    function inputFocusHandler(e) {
      var elt = e.target;

      if (dp.stringToDate(elt.value) >= dp.stringToDate(outward.value)) {
        return;
      }

      elt.value = outward.value;

      // Case classes are 'inward' AND 'one-day-after' : set date to selected date +1
      if (elt.classList.contains('one-day-after')) {
        outwardDate = outward.value;
        outwardDate = outwardDate.split('/');
        inwardDate = new Date(outwardDate[2] + ',' + outwardDate[1] + ',' + outwardDate[0]);
        inwardDate.setTime(inwardDate.getTime() + (24 * 60 * 60 * 1000));
        month = ((inwardDate.getMonth() + 1) < 10) ? '0' + (inwardDate.getMonth() + 1) : (inwardDate.getMonth() + 1);
        day = (inwardDate.getDate() < 10) ? '0' + inwardDate.getDate() : inwardDate.getDate();
        inwardDate = day + '/' + month + '/' + inwardDate.getFullYear();
        elt.value = inwardDate;
      }

      dp.selectDate();
    }
  }

  function renderDatepicker(date) {
    /* jshint validthis: true */
    var rangeStart = this.rangeStart(date),
        rangeEnd = this.rangeEnd(date),
        numDays = this.daysBetween(rangeStart, rangeEnd),
        td = document.createElement('td'),
        tableCells = "",
        weekRow = 0,
        adjustShortDayNames = this.adjustDays(this.shortDayNames),
        adjustDayNames = this.adjustDays(this.dayNames),
        i = 0,
        len = 0;

    td.classList.add('table-month-wrapper');
    tableCells += '<table role="grid" aria-labelledby="month-name" class="month-cal"><tr>';

    for (i = 0, len = adjustShortDayNames.length; i < len; i++) {
      tableCells += '<th id="' + adjustDayNames[i] + '"><abbr title="' + adjustDayNames[i] + '">' + adjustShortDayNames[i] + '</abbr></th>';
    }

    for (i = 0; i <= numDays; i++) {
      var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 0),
          firstDay = 0,
          firstDayOfWeek = currentDay;

      if (this.isFirstDayOfWeek(currentDay)) {

        if (this.selectWeek && this.isNewDateAllowed(firstDayOfWeek)) {
          tableCells += '<tr id="row' + weekRow + '" date="' + this.dateToString(currentDay) + '" class="selectable_week">';
        }
        else {
          tableCells += '<tr id="row' + weekRow + '">';
        }

        weekRow++;

        if (this.showWeek === 1) {
          tableCells += '<td class="week_num">' + this.getWeekNum(currentDay) + '</td>';
        }
      }

      if ((this.selectWeek === 0 && currentDay.getMonth() === date.getMonth() && this.isNewDateAllowed(currentDay) && !this.isHoliday(currentDay)) || (this.selectWeek === 1 && currentDay.getMonth() === date.getMonth() && this.isNewDateAllowed(firstDayOfWeek))) {
        tableCells += '<td id="day' + i + '" class="selectable_day" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjustDayNames[firstDay] + '">' + currentDay.getDate() + '</td>';
      }
      else if (currentDay.getMonth() === date.getMonth()) {
        tableCells += '<td id="day' + i + '" class="unselected_month" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjustDayNames[firstDay] + '">' + currentDay.getDate() + '</td>';
      }
      else {
        tableCells += '<td id="day' + i + '" class="unselected_month off_month" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjustDayNames[firstDay] + '">' + currentDay.getDate() + '</td>';
      }

      firstDay++;

      if (this.isLastDayOfWeek(currentDay)) {
        tableCells += '</tr>';
      }
    }

    tableCells += '</tr></table>';
    td.innerHTML = tableCells;

    return td;
  }

  function clickEvent() {
    return ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ) ? 'touchend' : 'click';
  }

  function selectMonth(date) {
    /* jshint validthis: true */
    var newMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        i = 0,
        l = 0;

    if (this.isNewDateAllowed(newMonth)) {
      if (!this.currentMonth || !(this.currentMonth.getFullYear() === newMonth.getFullYear() && this.currentMonth.getMonth() === newMonth.getMonth())) {

        this.tbody.empty();
        this.currentMonth = newMonth;

        // Render the current month
        // var calendar = this.renderDatepicker(date),
        var firstMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        this.tbody.appendChild(this.renderDatepicker(date));

        this.monthNameSpan[0].empty().innerText = this.monthNames[firstMonth.getMonth()];
        this.yearNameSpan[0].empty().innerText = this.currentMonth.getFullYear();
        this.firstMonthAllowed(firstMonth);

        // Iterate to render next months
        if (this.nbCalendar > 1) {
          for (i = 1; i < this.nbCalendar; i++) {
            var nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + (this.nbCalendar - i), 1);
            this.monthNameSpan[i].empty().innerText = this.monthNames[nextMonth.getMonth()];
            this.yearNameSpan[i].empty().innerText = nextMonth.getFullYear();
            // calendar += this.renderDatepicker(nextMonth);
          this.tbody.appendChild(this.renderDatepicker(nextMonth));

          }
        }

        // this.tbody.empty().appendChild(createElement(calendar)) ;

        var selectableDays = this.tbody.querySelectorAll('.selectable_day'),
            selectableWeeks = this.tbody.querySelectorAll('.selectable_week'),
            today = this.tbody.querySelector('td[date="' + this.dateToString(new Date()) + '"]'),
            tr = this.tbody.querySelectorAll('tr');

        if (this.selectWeek === 0) {
          for (i = 0, l = selectableDays.length; i < l; i++) {
            selectableDays[i].addEventListener('click', this.bindToObj(function (event) {
              this.changeInput(event.target.getAttribute("date"));
            }));
          }
        }
        else {
          for (i = 0, l = selectableWeeks.length; i < l; i++) {
            selectableWeeks[i].addEventListener('click', this.bindToObj(function (event) {
              this.changeInput(event.target.parentNode.getAttribute("date"));
            }));
          }
        }

        if (today !== null) {
          today.classList.add('today');
        }

        if (this.selectWeek === 1) {
          for (i = 0, l = tr.length; i < l; i++) {
            tr[i].onmouseover = function () {
              this.classList.add("hover");
            };
            tr[i].onmouseout = function () {
              this.classList.remove("hover");
            };
          }
        }
        else {
          for (i = 0, l = selectableDays.length; i < l; i++) {
            selectableDays[i].onmouseover = function () {
              this.classList.add("hover");
            };
            selectableDays[i].onmouseout = function () {
              this.classList.remove("hover");
            };
          }
        }
      }

      // $('.selected', this.tbody).removeClass("selected").attr('aria-selected', 'false');
      var prevSelected = this.tbody.querySelectorAll('.selected'),
          currentSelected = this.tbody.querySelectorAll('td[date="' + this.selectedDateString + '"], tr[date="' + this.selectedDateString + '"]');
      for (i = 0, l = prevSelected.length; i < l; i++) {
        prevSelected[i].classList.remove('selected');
        prevSelected[i].setAttribute('aria-selected', 'true');
      }
      // $('td[date="' + this.selectedDateString + '"], tr[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected").attr('aria-selected', 'true');
      for (i = 0, l = currentSelected.length; i < l; i++) {
        currentSelected[i].classList.add('selected');
        currentSelected[i].setAttribute('aria-selected', 'true');
      }
    }
  }

  function selectDate(date) {
    /* jshint validthis: true */

    if (typeof (date) === "undefined") {
      date = this.stringToDate(this.input.value);
    }

    if (!date) {
      date = new Date();
    }

    if (this.selectWeek === 1 && !this.isFirstDayOfWeek(date)) {
      date = new Date(date.getFullYear(), date.getMonth(), (date.getDate() - date.getDay() + this.startOfWeek), 12, 0);
    }

    if (this.isNewDateAllowed(date)) {
      this.selectedDate = date;
      this.selectedDateString = this.dateToString(this.selectedDate);
      this.selectMonth(this.selectedDate);
    }
    else if ((this.dateMin) && this.daysBetween(this.dateMin, date) < 0) {
      this.selectedDate = this.dateMin;
      this.selectMonth(this.dateMin);
      this.input.value = ' ';
    }
    else {
      this.selectMonth(this.dateMax);
      this.input.value = ' ';
    }
  }

  function isNewDateAllowed(date) {
    /* jshint validthis: true */

    return ((!this.dateMin) || this.daysBetween(this.dateMin, date) >= 0) && ((!this.dateMax) || this.daysBetween(date, this.dateMax) >= 0);
  }

  function isHoliday(date) {
    /* jshint validthis: true */
    return ((this.indexFor(this.selectableDays, date.getDay()) === false || this.indexFor(this.nonSelectable, this.dateToString(date)) !== false) || this.indexFor(this.recNonSelectable, this.dateToShortString(date)) !== false);
  }

  function changeInput(dateString) {
    /* jshint validthis: true */
    this.input.value = dateString;
    this.input.onchange();
    if (this.input.type !== "hidden") {
      this.hide();
    }
  }

  function show() {
    /* jshint validthis: true */
    this.errorMsg.style.display = 'none';
    this.rootLayers.setAttribute('aria-hidden', 'false');
    // this.rootLayers.fadeIn('fast'); // @todo
    this.rootLayers.style.display = 'block';
    document.addEventListener(this.clickEvent(), this.hideIfClickOutside);
    this.input.removeEventListener("focus", this.show);
    this.input.setAttribute('autocomplete', 'off');
    document.body.addEventListener('keydown', this.keydownHandler);
    this.setPosition();
  }

  function hide() {
    /* jshint validthis: true */
    if (this.input.type !== "hidden") {
      this.rootLayers.setAttribute('aria-hidden', 'true');
      // this.rootLayers.fadeOut('fast'); // @todo
      this.rootLayers.style.display = 'none';  
      document.removeEventListener(this.clickEvent(), this.hideIfClickOutside);
      this.input.addEventListener('focus', this.show);
      document.body.removeEventListener('keydown', this.keydownHandler);
    }
  }

  // function documentClickHandler(event) {

  // }

  function hideIfClickOutside(event) {
    /* jshint validthis: true */
    if (event.target !== this.input && !this.dateSelector.length) {
      this.hide();
    }
  }

  function keydownHandler(event) {
    /* jshint validthis: true */
    switch (event.keyCode) {
      // Tab & ctrl key
      case 9:
      case 27:
        this.hide();
        return;
      // Enter key
      case 13:
        if (this.isNewDateAllowed(this.stringToDate(this.selectedDateString)) && !this.isHoliday(this.stringToDate(this.selectedDateString))) {
          this.changeInput(this.selectedDateString);
        }
        break;
      // Page up key
      case 33:
        this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
        break;
      // Page down key
      case 34:
        this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
        break;
      // Up arrow key
      case 38:
        this.moveDateBy(-7);
        break;
      // Down arrow key
      case 40:
        this.moveDateBy(7);
        break;
      // Left arrow key
      case 37:
        if (this.selectWeek === 0) {
          this.moveDateBy(-1);
        }
        break;
      // Right arrow key
      case 39:
        if (this.selectWeek === 0) {
          this.moveDateBy(1);
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  }

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

  function setDateFormat() {
    /* jshint validthis: true */
    switch (this.dateFormat) {
      case "dd/mm/YYYY":
        this.reg = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[3], parseInt(matches[2]-1), matches[1]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1) + "/" + date.getFullYear();
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1);
        };
        break;
      case "FF dd YYYY":
        this.reg = new RegExp(/^([a-zA-Z]+) (\d{1,2}) (\d{4})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[3], this.indexFor(this.monthNames, matches[1]), matches[2]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return this.monthNames[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.monthNames[date.getMonth()] + " " + this.strpad(date.getDate());
        };
        break;
      case "dd MM YYYY":
        this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]{3}) (\d{4})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[3], this.indexFor(this.shortMonthNames, matches[2]), matches[1]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + " " + this.shortMonthNames[date.getMonth()] + " " + date.getFullYear();
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + " " + this.shortMonthNames[date.getMonth()];
        };
        break;
      case "MM dd YYYY":
        this.reg = new RegExp(/^([a-zA-Z]{3}) (\d{1,2}) (\d{4})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[3], this.indexFor(this.shortMonthNames, matches[1]), matches[2]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return this.shortMonthNames[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.shortMonthNames[date.getMonth()] + " " + this.strpad(date.getDate());
        };
        break;
      case "dd FF YYYY":
        this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]+) (\d{4})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[3], this.indexFor(this.monthNames, matches[2]), matches[1]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + " " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getDate()) + " " + this.monthNames[date.getMonth()];
        };
        break;
      // case "YYYY/mm/dd":
      default:
        this.reg = new RegExp(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        this.dateDecode = function (matches) {
          return new Date(matches[1], parseInt(matches[2]-1), matches[3]);
        };
        this.dateEncode = function (date) {
          /* jshint validthis: true */
          return date.getFullYear() + "/" + this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());
        };
        this.dateEncodeS = function (date) {
          /* jshint validthis: true */
          return this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());
        };
        break;
    }
  }

  function stringToDate(string) {
    /* jshint validthis: true */

    var matches = string.match(this.reg);

    if (matches) {
      if (matches[3] === 0 && matches[2] === 0 && matches[1] === 0) {
        return null;
      }
      else {
        return this.dateDecode(matches);
      }
    }
    else {
      return null;
    }
  }

  function dateToString(date) {
    /* jshint validthis: true */
    return this.dateEncode(date);
  }

  function dateToShortString(date) {
    /* jshint validthis: true */
    return this.dateEncodeS(date);
  }

  function setPosition() {
    /* jshint validthis: true */
    return
    var win = $(window),
      inputPosition = this.input.position(),
      inputOffset = this.input.offset(),
      dateSelectorHeight = this.rootLayers.outerHeight();

    // Define viewport
    var viewport = {top: win.scrollTop()};
    viewport.bottom = viewport.top + win.height();

    // Get input position
    inputOffset.bottom = inputOffset.top + this.input.outerHeight();

    // Enough available space under the input or no place above
    if (((viewport.bottom - inputOffset.bottom) >= dateSelectorHeight) || ((typeof BookingWidgetState !== 'undefined') && (inputOffset.bottom - $(window).scrollTop() - 80 < dateSelectorHeight))) {
      this.rootLayers.css({
        top: inputPosition.top + this.input.outerHeight() + 15,
        bottom: 'auto'
      });
      this.rootLayers.addClass('under');
      this.rootLayers.removeClass('on-top');
    }
    // No space available under the input
    else {
      this.rootLayers.css({
        bottom: inputPosition.top + this.input.outerHeight() + 15,
        top: 'auto'
      });
      this.rootLayers.addClass('on-top');
      this.rootLayers.removeClass('under');
    }
  }

  function moveDateBy(amount) {
    /* jshint validthis: true */
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
    this.selectDate(newDate);
  }

  function moveDateMonthBy(amount) {
    /* jshint validthis: true */
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
    if (newDate.getMonth() === this.selectedDate.getMonth() + amount + 1) {
      newDate.setDate(0);
    }
    this.selectDate(newDate);
  }

  function moveMonthBy(amount) {
    /* jshint validthis: true */
    var newMonth = null;
    if (amount < 0) {
      newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount + 1, -1);
    }
    else {
      newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, 1);
    }
    this.selectMonth(newMonth);
  }

  function firstMonthAllowed(firstMonth) {
    /* jshint validthis: true */
    if (this.isNewDateAllowed(firstMonth)) {
      this.prevBtn.classList.remove('stop');
    }
    else {
      this.prevBtn.classList.add('stop');
    }
  }

  function monthName(date) {
    /* jshint validthis: true */
    return this.monthNames[date.getMonth()];
  }

  function getMonthSelect() {
    /* jshint validthis: true */
    var monthSelect = '<select>';
    for (var i = 0, len = this.monthNames.length; i < len; i++) {
      if (i === this.currentMonth.getMonth()) {
        monthSelect += '<option value="' + (i) + '" selected="selected">' + this.monthNames[i] + '</option>';
      }
      else {
        monthSelect += '<option value="' + (i) + '">' + this.monthNames[i] + '</option>';
      }
    }
    monthSelect += '</select>';

    return monthSelect;
  }

  function bindToObj(fn) {
    /* jshint validthis: true */
    var self = this;
    return function () {
      return fn.apply(self, arguments);
    };
  }

  function bindMethodsToObj() {
    /* jshint validthis: true */
    for (var i = 0, len = arguments.length; i < len; i++) {
      this[arguments[i]] = this.bindToObj(this[arguments[i]]);
    }
  }

  function indexFor(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (value === array[i]) {
        return i;
      }
    }
    return false;
  }

  function monthNum(monthName) {
    /* jshint validthis: true */
    return this.indexFor(this.monthNames, monthName);
  }

  function shortMonthNum(monthName) {
    /* jshint validthis: true */
    return this.indexFor(this.shortMonthNames, monthName);
  }

  function shortDayNum(dayName) {
    /* jshint validthis: true */
    return this.indexFor(this.shortDayNames, dayName);
  }

  function daysBetween(start, end) {
    start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return (end - start) / 86400000;
  }

  function changeDayTo(dayOfWeek, date, direction) {
    var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
  }

  function rangeStart(date) {
    /* jshint validthis: true */
    return this.changeDayTo(this.startOfWeek, new Date(date.getFullYear(), date.getMonth()), -1);
  }

  function rangeEnd(date) {
    /* jshint validthis: true */
    return this.changeDayTo((this.startOfWeek - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
  }

  function isFirstDayOfWeek(date) {
    /* jshint validthis: true */
    return date.getDay() === this.startOfWeek;
  }

  function getWeekNum(date) {
    /* jshint validthis: true */
    var dateWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
    var firstDayOfYear = new Date(dateWeek.getFullYear(), 0, 1, 12, 0);
    var n = parseInt(this.daysBetween(firstDayOfYear, dateWeek)) + 1;
    return Math.floor((dateWeek.getDay() + n + 5) / 7) - Math.floor(dateWeek.getDay() / 5);
  }

  function isLastDayOfWeek(date) {
    /* jshint validthis: true */
    return date.getDay() === (this.startOfWeek - 1) % 7;
  }

  function showError(error) {
    /* jshint validthis: true */
    var errors = $('.error_msg', this.rootLayers);
    errors.html(error);
    errors.slideDown(400, function () {
      setTimeout("$('.error_msg', this.rootLayers).slideUp(200);", 2000);
    });
  }

  function adjustDays(days) {
    /* jshint validthis: true */
    var newDays = [];
    for (var i = 0, len = days.length; i < len; i++) {
      newDays[i] = days[(i + this.startOfWeek) % 7];
    }
    return newDays;
  }

  function strpad(num) {
    if (parseInt(num) < 10) {
      return "0" + parseInt(num);
    }
    else {
      return parseInt(num);
    }
  }

  /*$.fn.jdPicker = function (opts) {
    return this.each(function () {
      new jdPicker(this, opts);
    });
  };

  $.jdPicker = {
    initialize: function (opts) {
      $("input.datepicker").jdPicker(opts);
    }
  };*/

  return function (el, opts) {
    new jdPicker(el, opts);
  };
})();
