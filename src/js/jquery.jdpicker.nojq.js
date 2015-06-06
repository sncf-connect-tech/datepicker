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

// var $ = require('../vendors/jquery-2.1.3.min/index.js');

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
  }

  function createElement(str) {
    var elt = document.createElement("div");
    elt.innerHTML = str;
    return elt.firstChild;
  }

  //////////////

  function jdPicker(el, opts) {
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
   * Return the current date
   */
  jdPicker.currentDate = function () {
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
  };


  /**
   * Default options
   * @type {Object}
   */
    //JdPicker i18n
  jdPicker.DEFAULT_OPTS = {
    month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    short_day_names: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    today_string: 'Today',
    error_out_of_range: "Selected date is out of range",
    selectable_days: [0, 1, 2, 3, 4, 5, 6],
    non_selectable: [],
    rec_non_selectable: [],
    start_of_week: 1,
    show_week: 0,
    select_week: 0,
    week_label: "",
    nb_calendar: 2,
    date_min: "",
    date_max: "",
    date_format: "dd/mm/YYYY",
    previous: "Previous",
    next: "Next"
  };

  jdPicker.prototype = {
    build: build,
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
    show_error: show_error,
    adjustDays: adjustDays,
    strpad: strpad
  };

  function build() {
    var self = this;

    this.wrapp = createElement('<div class="datepicker-wrapper">');
    this.input.parentNode.insertBefore(this.wrapp, this.input);
    this.wrapp.appendChild(this.input);

    switch (this.date_format) {
      case "dd/mm/YYYY":
        this.reg = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        this.date_decode = "new Date(matches[3], parseInt(matches[2]-1), matches[1]);";
        this.date_encode = 'this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1) + "/" + date.getFullYear();';
        this.date_encode_s = 'this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1)';
        break;
      case "FF dd YYYY":
        this.reg = new RegExp(/^([a-zA-Z]+) (\d{1,2}) (\d{4})$/);
        this.date_decode = "new Date(matches[3], this.indexFor(this.month_names, matches[1]), matches[2]);";
        this.date_encode = 'this.month_names[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();';
        this.date_encode_s = 'this.month_names[date.getMonth()] + " " + this.strpad(date.getDate());';
        break;
      case "dd MM YYYY":
        this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]{3}) (\d{4})$/);
        this.date_decode = "new Date(matches[3], this.indexFor(this.short_month_names, matches[2]), matches[1]);";
        this.date_encode = 'this.strpad(date.getDate()) + " " + this.short_month_names[date.getMonth()] + " " + date.getFullYear();';
        this.date_encode_s = 'this.strpad(date.getDate()) + " " + this.short_month_names[date.getMonth()];';
        break;
      case "MM dd YYYY":
        this.reg = new RegExp(/^([a-zA-Z]{3}) (\d{1,2}) (\d{4})$/);
        this.date_decode = "new Date(matches[3], this.indexFor(this.short_month_names, matches[1]), matches[2]);";
        this.date_encode = 'this.short_month_names[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();';
        this.date_encode_s = 'this.short_month_names[date.getMonth()] + " " + this.strpad(date.getDate());';
        break;
      case "dd FF YYYY":
        this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]+) (\d{4})$/);
        this.date_decode = "new Date(matches[3], this.indexFor(this.month_names, matches[2]), matches[1]);";
        this.date_encode = 'this.strpad(date.getDate()) + " " + this.month_names[date.getMonth()] + " " + date.getFullYear();';
        this.date_encode_s = 'this.strpad(date.getDate()) + " " + this.month_names[date.getMonth()];';
        break;
      case "YYYY/mm/dd":
      default:
        this.reg = new RegExp(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        this.date_decode = "new Date(matches[1], parseInt(matches[2]-1), matches[3]);";
        this.date_encode = 'date.getFullYear() + "/" + this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());';
        this.date_encode_s = 'this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());';
        break;
    }

    if (this.date_max !== "" && this.date_max.match(this.reg)) {
      var matches = this.date_max.match(this.reg);
      this.date_max = eval(this.date_decode);
    }
    else {
      this.date_max = "";
    }

    if (this.date_min !== "" && this.date_min.match(this.reg)) {
      var matches = this.date_min.match(this.reg);
      this.date_min = eval(this.date_decode);
    }
    else {
      this.date_min = "";
    }

    var monthHead = document.createElement('div'),
        monthHeading = null;
    this.monthNameSpan = [];
    this.yearNameSpan = [];

    for (var i = 0; i < this.nb_calendar; i++) {
      monthHeading = createElement('<span role="heading" aria-atomic="true" aria-live="assertive" class="month-head month-head-' + i + '"></span> ');
      this.monthNameSpan.push(createElement('<span class="month-name month-name-' + i + '"></span> '));
      this.yearNameSpan.push(createElement('<span class="year-name year-name-' + i + '"></span>'));
      monthHeading.appendChild(this.monthNameSpan[i]);
      monthHeading.appendChild(createElement('<span> </span>'));
      monthHeading.appendChild(this.yearNameSpan[i]);
      monthHead.appendChild(monthHeading);
    }

    // var monthNav = $('<p class="month-nav">' + '<span class="button prev idp-left" title="' + this.previous + ' [Page-Up]" role="button">' + this.previous + '</span>' + '<span class="button next idp-right" title="' + this.next + ' [Page-Down]" role="button">' + this.next + '</span>' + monthHead + '</p>');
    var monthNav = createElement('<p class="month-nav">' + '<span class="button prev idp-left" title="' + this.previous + ' [Page-Up]" role="button">' + this.previous + '</span>' + '<span class="button next idp-right" title="' + this.next + ' [Page-Down]" role="button">' + this.next + '</span></p>');
    monthNav.appendChild(monthHead);

    // for (var i = 0; i < this.nb_calendar; i++) {
    //   this.monthNameSpan[i] = $(".month-name-" + i, monthNav);
    //   this.yearNameSpan[i] = $(".year-name-" + i, monthNav);
    // }

    // $(".prev", monthNav).click(this.bindToObj(function (e) {
    var prev = monthNav.querySelectorAll('.prev'),
        next = monthNav.querySelectorAll('.next'),
        elt = null,
        i = 0,
        l = 0;

    for (i = 0, l = prev.length; i<l; i++) {
      prev[0].click = this.bindToObj(function (e) {
        this.moveMonthBy(Number('-1')); // Always go 1 month backward, even if 2 months or more are displayed
        e.preventDefault();
        e.stopPropagation();
        var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), -1);
        this.firstMonthAllowed(newMonth);
      });
    }

    for (i = 0, l = next.length; i<l; i++) {
      prev[0].click = this.bindToObj(function (e) {
        this.moveMonthBy(1); // Always go 1 month forward, even if 2 months or more are displayed
        e.preventDefault();
        e.stopPropagation();
      });
    }

    this.errorMsg = createElement('<div class="error_msg" />');
    var nav = createElement('<div class="nav" />'),
        tableShell = '<table role="grid" aria-labelledby="month-name" class="month-wrapper"><thead><tr>';

    nav.appendChild(this.errorMsg);
    nav.appendChild(monthNav);

    if (this.show_week == 1) {
      tableShell += '<th class="week_label">' + (this.week_label) + '</th>';
    }

    tableShell += "</tr></thead><tbody><tr><td></td></tr></tbody></table>";
    tableShell = createElement(tableShell);

    var today_date = createElement('<div class="today-date" role="button">' + this.today_string + '</div>'),
      style = (this.input.type == "hidden") ? ' style="display:block; position:static; margin:0 auto"' : '';

    this.dateSelector = createElement('<div class="date-selector" aria-hidden="true"' + style + '></div>');
    this.dateSelector.appendChild(nav);
    this.dateSelector.appendChild(tableShell);
    this.dateSelector.appendChild(today_date);
    this.input.parentNode.appendChild(this.dateSelector);  
    this.rootLayers = this.dateSelector;

    today_date.click = this.bindToObj(function () {
      this.changeInput(jdPicker.currentDate());
    });

    this.tbody = this.dateSelector.querySelector('tbody tr');

    this.input.onchange = (this.bindToObj(function () {
      this.selectDate();
    }));

    // Fill inwardDate with outwardDate
    var parent = this.input.parentNode
        parentForm = null,
        outward = null;
    while (parentForm !== null && parentForm.tagName !== 'FORM') {
      parentForm = parentForm.parentNode;
    }
    if (parentForm !== null) {
      outward = parentForm.querySelector('input.outward')
    }

    this.wrapp.addEventListener('click focus', function (e) {
      var elt = e.target;
      if (elt.classList.indexOf('inward') > -1) {
        elt.value = outward.value;
        self.selectDate();
      }
      // Case classes are 'inward' AND 'one-day-after' : set date to selected date +1
      if (elt.classList.indexOf('inward') > -1 && elt.classList.indexOf('inward') > -1) {
      // if ($(this).hasClass('inward') && $(this).hasClass('one-day-after')) {
        outwardDate = $(this).parents('form').find('input.outward').val();
        outwardDate = outwardDate.split('/');
        inwardDate = new Date(outwardDate[2] + ',' + outwardDate[1] + ',' + outwardDate[0]);
        inwardDate.setTime(inwardDate.getTime() + (24 * 60 * 60 * 1000));
        month = ((inwardDate.getMonth() + 1) < 10) ? '0' + (inwardDate.getMonth() + 1) : (inwardDate.getMonth() + 1);
        day = (inwardDate.getDate() < 10) ? '0' + inwardDate.getDate() : inwardDate.getDate();
        inwardDate = day + '/' + month + '/' + inwardDate.getFullYear();
        this.value = inwardDate;
        self.selectDate();
      }
    });

    this.selectDate();
  }

  function renderDatepicker(date) {
    var rangeStart = this.rangeStart(date),
        rangeEnd = this.rangeEnd(date),
        numDays = this.daysBetween(rangeStart, rangeEnd),
        td = document.createElement('td'),
        tableCells = "",
        weekRow = 0,
        adjust_short_day_names = this.adjustDays(this.short_day_names),
        adjust_day_names = this.adjustDays(this.day_names);

    td.classList.add('table-month-wrapper');
    tableCells += '<table role="grid" aria-labelledby="month-name" class="month-cal"><tr>';

    for (var i = 0, len = adjust_short_day_names.length; i < len; i++) {
      tableCells += '<th id="' + adjust_day_names[i] + '"><abbr title="' + adjust_day_names[i] + '">' + adjust_short_day_names[i] + '</abbr></th>';
    }

    for (var i = 0; i <= numDays; i++) {
      var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);

      if (this.isFirstDayOfWeek(currentDay)) {

        var firstDayOfWeek = currentDay,
          lastDayOfWeek = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + 6, 12, 00),
          firstDay = 0;

        if (this.select_week && this.isNewDateAllowed(firstDayOfWeek)) {
          tableCells += '<tr id="row' + weekRow + '" date="' + this.dateToString(currentDay) + '" class="selectable_week">';
        }
        else {
          tableCells += '<tr id="row' + weekRow + '">';
        }

        weekRow++

        if (this.show_week == 1) {
          tableCells += '<td class="week_num">' + this.getWeekNum(currentDay) + '</td>';
        }
      }

      if ((this.select_week == 0 && currentDay.getMonth() == date.getMonth() && this.isNewDateAllowed(currentDay) && !this.isHoliday(currentDay)) || (this.select_week == 1 && currentDay.getMonth() == date.getMonth() && this.isNewDateAllowed(firstDayOfWeek))) {
        tableCells += '<td id="day' + i + '" class="selectable_day" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjust_day_names[firstDay] + '">' + currentDay.getDate() + '</td>';
      }
      else if (currentDay.getMonth() == date.getMonth()) {
        tableCells += '<td id="day' + i + '" class="unselected_month" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjust_day_names[firstDay] + '">' + currentDay.getDate() + '</td>';
      }
      else {
        tableCells += '<td id="day' + i + '" class="unselected_month off_month" date="' + this.dateToString(currentDay) + '" role="gridcell" aria-selected="false" headers="row' + weekRow + ' ' + adjust_day_names[firstDay] + '">' + currentDay.getDate() + '</td>';
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
    var clickEvent = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ) ? 'touchend' : 'click';
    return clickEvent;
  }

  function selectMonth(date) {
    var newMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (this.isNewDateAllowed(newMonth)) {
      if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {

        this.tbody.empty();
        this.currentMonth = newMonth;

        // Render the current month
        // var calendar = this.renderDatepicker(date),
         var   firstMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        this.tbody.appendChild(this.renderDatepicker(date));

        this.monthNameSpan[0].empty().innerText = this.month_names[firstMonth.getMonth()];
        this.yearNameSpan[0].empty().innerText = this.currentMonth.getFullYear();
        this.firstMonthAllowed(firstMonth);

        // Iterate to render next months
        if (this.nb_calendar > 1) {
          for (var i = 1; i < this.nb_calendar; i++) {
            var nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + (this.nb_calendar - i), 1);
            this.monthNameSpan[i].empty().innerText = this.month_names[nextMonth.getMonth()];
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

        if (this.select_week == 0) {
          for (var i = 0, l = selectableDays.length; i < l; i++) {
            selectableDays[i].addEventListener('click', this.bindToObj(function (event) {
              this.changeInput(event.target.getAttribute("date"));
            }));
          }
        }
        else {
          for (var i = 0, l = selectableWeeks.length; i < l; i++) {
            selectableWeeks[i].addEventListener('click', this.bindToObj(function (event) {
              this.changeInput(event.target.parentNode.getAttribute("date"));
            }));
          }
        }

        if (today !== null) {
          today.classList.add('today');
        }

        if (this.select_week == 1) {
          for (var i in tr) {
            tr[i].onmouseover = function () {
              this.classList.add("hover");
            };
            tr[i].onmouseout = function () {
              this.classList.remove("hover");
            };
          }
        }
        else {
          for (var i in selectableDays) {
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
      for (var i = 0, l = prevSelected.length; i < l; i++) {
        prevSelected[i].classList.remove('selected');
        prevSelected[i].setAttribute('aria-selected', 'true');
      }
      // $('td[date="' + this.selectedDateString + '"], tr[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected").attr('aria-selected', 'true');
      for (var i = 0, l = currentSelected.length; i < l; i++) {
        currentSelected[i].classList.add('selected');
        currentSelected[i].setAttribute('aria-selected', 'true');
      }
    }
  }

  function selectDate(date) {
    if (typeof (date) == "undefined") {
      date = this.stringToDate(this.input.value);
    }

    if (!date) {
      date = new Date();
    }

    if (this.select_week == 1 && !this.isFirstDayOfWeek(date)) {
      date = new Date(date.getFullYear(), date.getMonth(), (date.getDate() - date.getDay() + this.start_of_week), 12, 00);
    }

    if (this.isNewDateAllowed(date)) {
      this.selectedDate = date;
      this.selectedDateString = this.dateToString(this.selectedDate);
      this.selectMonth(this.selectedDate);
    }
    else if ((this.date_min) && this.daysBetween(this.date_min, date) < 0) {
      this.selectedDate = this.date_min;
      this.selectMonth(this.date_min);
      this.input.value = ' ';
    }
    else {
      this.selectMonth(this.date_max);
      this.input.value = ' ';
    }
  }

  function isNewDateAllowed(date) {
    return ((!this.date_min) || this.daysBetween(this.date_min, date) >= 0) && ((!this.date_max) || this.daysBetween(date, this.date_max) >= 0);
  }

  function isHoliday(date) {
    return ((this.indexFor(this.selectable_days, date.getDay()) === false || this.indexFor(this.non_selectable, this.dateToString(date)) !== false) || this.indexFor(this.rec_non_selectable, this.dateToShortString(date)) !== false);
  }

  function changeInput(dateString) {
    this.input.value = dateString;
    this.input.onchange();
    if (this.input.type != "hidden") {
      this.hide();
    }
  }

  function show() {
    this.errorMsg.style.display = 'none';
    this.rootLayers.setAttribute('aria-hidden', 'false')
    // this.rootLayers.fadeIn('fast'); // @todo
    this.rootLayers.style.display = 'block';
    document.addEventListener(this.clickEvent(), this.hideIfClickOutside);
    this.input.removeEventListener("focus", this.show)
    this.input.setAttribute('autocomplete', 'off');
    document.body.addEventListener('keydown', this.keydownHandler);
    this.setPosition();
  }

  function hide() {
    if (this.input.type != "hidden") {
      this.rootLayers.setAttribute('aria-hidden', 'true');
      // this.rootLayers.fadeOut('fast'); // @todo
      this.rootLayers.style.display = 'none';  
      document.removeEventListener(this.clickEvent(), this.hideIfClickOutside);
      this.input.addEventListener('focus', this.show);
      document.body.removeEventListener('keydown', this.keydownHandler);
    }
  }

  function documentClickHandler(event) {

  }

  function hideIfClickOutside(event) {
    if (event.target != this.input && !this.dateSelector.length) {
      this.hide();
    }
  }

  function keydownHandler(event) {
    switch (event.keyCode) {
      // Tab & ctrl key
      case 9:
      case 27:
        this.hide();
        return;
        break;
      // Enter key
      case 13:
        if (this.isNewDateAllowed(this.stringToDate(this.selectedDateString)) && !this.isHoliday(this.stringToDate(this.selectedDateString))) this.changeInput(this.selectedDateString);
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
        if (this.select_week == 0) this.moveDateBy(-1);
        break;
      // Right arrow key
      case 39:
        if (this.select_week == 0) this.moveDateBy(1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function stringToDate(string) {
    var matches;

    if (matches = string.match(this.reg)) {
      if (matches[3] == 0 && matches[2] == 0 && matches[1] == 0) {
        return null;
      }
      else {
        return eval(this.date_decode);
      }
    }
    else {
      return null;
    }
  }

  function dateToString(date) {
    return eval(this.date_encode);
  }

  function dateToShortString(date) {
    return eval(this.date_encode_s);
  }

  function setPosition() {
    return
    var win = $(window),
      input_position = this.input.position(),
      input_offset = this.input.offset(),
      date_selector_height = this.rootLayers.outerHeight();

    // Define viewport
    var viewport = {top: win.scrollTop()};
    viewport.bottom = viewport.top + win.height();

    // Get input position
    var input_offset = this.input.offset();
    input_offset.bottom = input_offset.top + this.input.outerHeight();

    // Enough available space under the input or no place above
    if (((viewport.bottom - input_offset.bottom) >= date_selector_height) || ((typeof BookingWidgetState !== 'undefined') && (input_offset.bottom - $(window).scrollTop() - 80 < date_selector_height))) {
      this.rootLayers.css({
        top: input_position.top + this.input.outerHeight() + 15,
        bottom: 'auto'
      });
      this.rootLayers.addClass('under');
      this.rootLayers.removeClass('on-top');
    }
    // No space available under the input
    else {
      this.rootLayers.css({
        bottom: input_position.top + this.input.outerHeight() + 15,
        top: 'auto'
      });
      this.rootLayers.addClass('on-top');
      this.rootLayers.removeClass('under');
    }
  }

  function moveDateBy(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
    this.selectDate(newDate);
  }

  function moveDateMonthBy(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
    if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
      newDate.setDate(0);
    }
    this.selectDate(newDate);
  }

  function moveMonthBy(amount) {
    if (amount < 0) {
      var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount + 1, -1);
    }
    else {
      var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, 1);
    }
    this.selectMonth(newMonth);
  }

  function firstMonthAllowed(firstMonth) {
    // $(".button.prev")
    var btn = document.querySelector('.button.prev'),
        classList = [];

    if (this.isNewDateAllowed(firstMonth)) {
      btn.classList.remove('stop');
    }
    else {
      btn.classList.add('stop');
    }
  }

  function monthName(date) {
    return this.month_names[date.getMonth()];
  }

  function getMonthSelect() {
    var monthSelect = '<select>';
    for (var i = 0, len = this.month_names.length; i < len; i++) {
      if (i == this.currentMonth.getMonth()) {
        monthSelect += '<option value="' + (i) + '" selected="selected">' + this.month_names[i] + '</option>';
      }
      else {
        monthSelect += '<option value="' + (i) + '">' + this.month_names[i] + '</option>';
      }
    }
    monthSelect += '</select>';

    return monthSelect;
  }

  function bindToObj(fn) {
    var self = this;
    return function () {
      return fn.apply(self, arguments)
    };
  }

  function bindMethodsToObj() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this[arguments[i]] = this.bindToObj(this[arguments[i]]);
    }
  }

  function indexFor(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (value == array[i]) {
        return i;
      }
    }
    return false;
  }

  function monthNum(month_name) {
    return this.indexFor(this.month_names, month_name);
  }

  function shortMonthNum(month_name) {
    return this.indexFor(this.short_month_names, month_name);
  }

  function shortDayNum(day_name) {
    return this.indexFor(this.short_day_names, day_name);
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
    return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1);
  }

  function rangeEnd(date) {
    return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
  }

  function isFirstDayOfWeek(date) {
    return date.getDay() == this.start_of_week;
  }

  function getWeekNum(date) {
    var date_week = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
    var firstDayOfYear = new Date(date_week.getFullYear(), 0, 1, 12, 00);
    var n = parseInt(this.daysBetween(firstDayOfYear, date_week)) + 1;
    return Math.floor((date_week.getDay() + n + 5) / 7) - Math.floor(date_week.getDay() / 5);
  }

  function isLastDayOfWeek(date) {
    return date.getDay() == (this.start_of_week - 1) % 7;
  }

  function show_error(error) {
    var errors = $('.error_msg', this.rootLayers);
    errors.html(error);
    errors.slideDown(400, function () {
      setTimeout("$('.error_msg', this.rootLayers).slideUp(200);", 2000);
    });
  }

  function adjustDays(days) {
    var newDays = [];
    for (var i = 0, len = days.length; i < len; i++) {
      newDays[i] = days[(i + this.start_of_week) % 7];
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
  }
})();
