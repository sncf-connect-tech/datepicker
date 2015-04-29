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

jdPicker = (function ($) {

  function jdPicker(el, opts) {
    if (typeof (opts) != "object") {
      opts = {};
    }
    $.extend(this, jdPicker.DEFAULT_OPTS, opts);

    this.input = $(el);
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
    date_format: "dd/mm/YYYY"
  };


  jdPicker.prototype = {
    build: function () {
      var self = this;

      this.wrapp = this.input.wrap('<div class="datepicker-wrapper">');

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

      if (this.date_max != "" && this.date_max.match(this.reg)) {
        var matches = this.date_max.match(this.reg);
        this.date_max = eval(this.date_decode);
      }
      else {
        this.date_max = "";
      }

      if (this.date_min != "" && this.date_min.match(this.reg)) {
        var matches = this.date_min.match(this.reg);
        this.date_min = eval(this.date_decode);
      }
      else {
        this.date_min = "";
      }

      var monthHead = "";
      this.monthNameSpan = [];
      this.yearNameSpan = [];

      for (var i = 0; i < this.nb_calendar; i++) {
        monthHead += '<span role="heading" aria-atomic="true" aria-live="assertive" class="month-head month-head-' + i + '">' + '<span class="month-name month-name-' + i + '"></span> ' + ' <span class="year-name year-name-' + i + '"></span>' + '</span> ';
      }

      var monthNav = $('<p class="month-nav">' + '<span class="button prev" title="Précédent [Page-Up]" role="button">Précédent</span>' + '<span class="button next" title="Suivant [Page-Down]" role="button">Suivant</span>' + monthHead + '</p>');

      for (var i = 0; i < this.nb_calendar; i++) {
        this.monthNameSpan[i] = $(".month-name-" + i, monthNav);
        this.yearNameSpan[i] = $(".year-name-" + i, monthNav);
      }

      $(".prev", monthNav).click(this.bindToObj(function (e) {
        this.moveMonthBy(Number('-1')); // Always go 1 month backward, even if 2 months or more are displayed
        e.preventDefault();
        e.stopPropagation();
        var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), -1);
        this.firstMonthAllowed(newMonth);
      }));

      $(".next", monthNav).click(this.bindToObj(function (e) {
        this.moveMonthBy(1); // Always go 1 month forward, even if 2 months or more are displayed
        e.preventDefault();
        e.stopPropagation();
      }));

      var error_msg = $('<div class="error_msg" />'),
        nav = $('<div class="nav" />').append(error_msg, monthNav),
        tableShell = '<table role="grid" aria-labelledby="month-name" class="month-wrapper"><thead><tr>';

      if (this.show_week == 1) {
        tableShell += '<th class="week_label">' + (this.week_label) + '</th>';
      }

      tableShell += "</tr></thead><tbody><tr><td></td></tr></tbody></table>";

      var today_date = $('<div class="today-date" role="button">' + this.today_string + '</div>'),
        style = (this.input.context.type == "hidden") ? ' style="display:block; position:static; margin:0 auto"' : '';

      this.dateSelector = this.rootLayers = $('<div class="date-selector" aria-hidden="true"' + style + '></div>').append(nav, tableShell, today_date).insertAfter(this.input);

      $(".today-date", this.dateSelector).click(this.bindToObj(function () {
        this.changeInput(jdPicker.currentDate());
      }));

      this.tbody = $("tbody tr ", this.dateSelector);

      this.input.change(this.bindToObj(function () {
        this.selectDate();
      }));

      // Fill inwardDate with outwardDate
      this.wrapp.bind('click focus', function () {
        if ($(this).hasClass('inward')) {
          $(this).val($(this).parents('form').find('input.outward').val());
          self.selectDate();
        }
        // Case classes are 'inward' AND 'one-day-after' : set date to selected date +1
        if ($(this).hasClass('inward') && $(this).hasClass('one-day-after')) {
          outwardDate = $(this).parents('form').find('input.outward').val();
          outwardDate = outwardDate.split('/');
          inwardDate = new Date(outwardDate[2] + ',' + outwardDate[1] + ',' + outwardDate[0]);
          inwardDate.setTime(inwardDate.getTime() + (24 * 60 * 60 * 1000));
          month = ((inwardDate.getMonth() + 1) < 10) ? '0' + (inwardDate.getMonth() + 1) : (inwardDate.getMonth() + 1);
          day = (inwardDate.getDate() < 10) ? '0' + inwardDate.getDate() : inwardDate.getDate();
          inwardDate = day + '/' + month + '/' + inwardDate.getFullYear();
          $(this).val(inwardDate);
          self.selectDate();
        }
      });

      this.selectDate();
    },

    renderDatepicker: function (date) {

      var rangeStart = this.rangeStart(date),
        rangeEnd = this.rangeEnd(date),
        numDays = this.daysBetween(rangeStart, rangeEnd),
        tableCells = "",
        weekRow = 0,
        adjust_short_day_names = this.adjustDays(this.short_day_names),
        adjust_day_names = this.adjustDays(this.day_names);

      tableCells += '<td class="table-month-wrapper"><table role="grid" aria-labelledby="month-name" class="month-cal"><tr>';

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

      tableCells += '</tr></table></td>';

      return tableCells;
    },

    clickEvent: function () {
      var clickEvent = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ) ? 'touchend' : 'click';
      return clickEvent;
    },

    selectMonth: function (date) {
      var newMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (this.isNewDateAllowed(newMonth)) {
        if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {

          this.currentMonth = newMonth;

          // Render the current month
          var calendar = this.renderDatepicker(date),
            firstMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);

          this.monthNameSpan[0].empty().append(this.month_names[firstMonth.getMonth()]);
          this.yearNameSpan[0].empty().append(this.currentMonth.getFullYear());
          this.firstMonthAllowed(firstMonth);

          // Iterate to render next months
          if (this.nb_calendar > 1) {
            for (var i = 1; i < this.nb_calendar; i++) {
              var nextMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + (this.nb_calendar - i), 1);
              this.monthNameSpan[i].empty().append(this.month_names[nextMonth.getMonth()]);
              this.yearNameSpan[i].empty().append(nextMonth.getFullYear());
              calendar += this.renderDatepicker(nextMonth);
            }
          }

          this.tbody.empty().append(calendar);

          if (this.select_week == 0) {
            $(".selectable_day", this.tbody).click(this.bindToObj(function (event) {
              this.changeInput($(event.target).attr("date"));
            }));
          }
          else {
            $(".selectable_week", this.tbody).click(this.bindToObj(function (event) {
              this.changeInput($(event.target.parentNode).attr("date"));
            }));
          }

          $("td[date='" + this.dateToString(new Date()) + "']", this.tbody).addClass("today");
          if (this.select_week == 1) {
            $("tr", this.tbody).mouseover(function () {
              $(this).addClass("hover");
            });
            $("tr", this.tbody).mouseout(function () {
              $(this).removeClass("hover");
            });
          }
          else {
            $("td.selectable_day", this.tbody).mouseover(function () {
              $(this).addClass("hover");
            });
            $("td.selectable_day", this.tbody).mouseout(function () {
              $(this).removeClass("hover");
            });
          }
        }

        $('.selected', this.tbody).removeClass("selected").attr('aria-selected', 'false');
        $('td[date="' + this.selectedDateString + '"], tr[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected").attr('aria-selected', 'true');
      }
    },

    selectDate: function (date) {
      if (typeof (date) == "undefined") {
        date = this.stringToDate(this.input.val());
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
        this.input.val(" ");
      }
      else {
        this.selectMonth(this.date_max);
        this.input.val(" ");
      }
    },

    isNewDateAllowed: function (date) {
      return ((!this.date_min) || this.daysBetween(this.date_min, date) >= 0) && ((!this.date_max) || this.daysBetween(date, this.date_max) >= 0);
    },

    isHoliday: function (date) {
      return ((this.indexFor(this.selectable_days, date.getDay()) === false || this.indexFor(this.non_selectable, this.dateToString(date)) !== false) || this.indexFor(this.rec_non_selectable, this.dateToShortString(date)) !== false);
    },

    changeInput: function (dateString) {
      this.input.val(dateString).change();
      if (this.input.context.type != "hidden") {
        this.hide();
      }
    },

    show: function () {
      $('.error_msg', this.rootLayers).css('display', 'none');
      this.rootLayers.attr('aria-hidden', 'false').fadeIn('fast');
      $(document).bind(this.clickEvent(), this.hideIfClickOutside);
      this.input.unbind("focus", this.show).attr('autocomplete', 'off');
      $(document.body).keydown(this.keydownHandler);
      this.setPosition();
    },

    hide: function () {
      if (this.input.context.type != "hidden") {
        this.rootLayers.attr('aria-hidden', 'true').fadeOut('fast');
        $(document).unbind(this.clickEvent(), this.hideIfClickOutside);
        this.input.focus(this.show);
        $(document.body).unbind("keydown", this.keydownHandler);
      }
    },

    hideIfClickOutside: function (event) {
      if (event.target != this.input[0] && !$(event.target).closest('.date-selector').length) {
        this.hide();
      }
    },

    keydownHandler: function (event) {
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
    },

    stringToDate: function (string) {
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
    },

    dateToString: function (date) {
      return eval(this.date_encode);
    },

    dateToShortString: function (date) {
      return eval(this.date_encode_s);
    },

    setPosition: function () {
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

      // Enough available space under the input
      if ((viewport.bottom - input_offset.bottom) >= date_selector_height) {
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
    },

    moveDateBy: function (amount) {
      var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
      this.selectDate(newDate);
    },

    moveDateMonthBy: function (amount) {
      var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
      if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
        newDate.setDate(0);
      }
      this.selectDate(newDate);
    },

    moveMonthBy: function (amount) {
      if (amount < 0) {
        var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount + 1, -1);
      }
      else {
        var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, 1);
      }
      this.selectMonth(newMonth);
    },

    firstMonthAllowed: function (firstMonth) {
      if (this.isNewDateAllowed(firstMonth)) {
        $(".button.prev").removeClass("stop");
      }
      else {
        $(".button.prev").addClass("stop");
      }
    },

    monthName: function (date) {
      return this.month_names[date.getMonth()];
    },

    getMonthSelect: function () {
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
    },

    bindToObj: function (fn) {
      var self = this;
      return function () {
        return fn.apply(self, arguments)
      };
    },

    bindMethodsToObj: function () {
      for (var i = 0, len = arguments.length; i < len; i++) {
        this[arguments[i]] = this.bindToObj(this[arguments[i]]);
      }
    },

    indexFor: function (array, value) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (value == array[i]) {
          return i;
        }
      }
      return false;
    },

    monthNum: function (month_name) {
      return this.indexFor(this.month_names, month_name);
    },

    shortMonthNum: function (month_name) {
      return this.indexFor(this.short_month_names, month_name);
    },

    shortDayNum: function (day_name) {
      return this.indexFor(this.short_day_names, day_name);
    },

    daysBetween: function (start, end) {
      start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
      end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      return (end - start) / 86400000;
    },

    changeDayTo: function (dayOfWeek, date, direction) {
      var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
    },

    rangeStart: function (date) {
      return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1);
    },

    rangeEnd: function (date) {
      return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
    },

    isFirstDayOfWeek: function (date) {
      return date.getDay() == this.start_of_week;
    },

    getWeekNum: function (date) {
      var date_week = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
      var firstDayOfYear = new Date(date_week.getFullYear(), 0, 1, 12, 00);
      var n = parseInt(this.daysBetween(firstDayOfYear, date_week)) + 1;
      return Math.floor((date_week.getDay() + n + 5) / 7) - Math.floor(date_week.getDay() / 5);
    },

    isLastDayOfWeek: function (date) {
      return date.getDay() == (this.start_of_week - 1) % 7;
    },

    show_error: function (error) {
      var errors = $('.error_msg', this.rootLayers);
      errors.html(error);
      errors.slideDown(400, function () {
        setTimeout("$('.error_msg', this.rootLayers).slideUp(200);", 2000);
      });
    },

    adjustDays: function (days) {
      var newDays = [];
      for (var i = 0, len = days.length; i < len; i++) {
        newDays[i] = days[(i + this.start_of_week) % 7];
      }
      return newDays;
    },

    strpad: function (num) {
      if (parseInt(num) < 10) {
        return "0" + parseInt(num);
      }
      else {
        return parseInt(num);
      }
    }

  };

  $.fn.jdPicker = function (opts) {
    return this.each(function () {
      new jdPicker(this, opts);
    });
  };

  $.jdPicker = {
    initialize: function (opts) {
      $("input.datepicker").jdPicker(opts);
    }
  };

  return jdPicker;
})(jQuery);
