'use strict';

(function () {

    window.DatePicker = {
      init: function (lang, backDate, nextDate) {
        require('./datepicker.js')(lang, backDate, nextDate);
      }
    }

})();
