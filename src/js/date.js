/**
 * Return the current date
 */
exports.current = function () {
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

exports.backward = function () {
  var THIRTY_DAYS = 90 * 24 * 60 * 60 * 1000,
    thirtyDaysFromNow = new Date(new Date() - THIRTY_DAYS),
    dd = thirtyDaysFromNow.getDate(),
    mm = thirtyDaysFromNow.getMonth() + 1,
    yyyy = thirtyDaysFromNow.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + "\/" + mm + "\/" + yyyy);
};

// For 6 months limitation
exports.sixMonthsFuture = function () {
  var allowedDate = new Date();

  allowedDate.setMonth(allowedDate.getMonth() + 6);

  var dd = allowedDate.getDate(),
    mm = allowedDate.getMonth() + 1,
    yyyy = allowedDate.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + "\/" + mm + "\/" + yyyy);
};

// For UK Railpass
exports.railpassMin = function() {
  var allowedDate = new Date();

  allowedDate.setDate(allowedDate.getDate() + 7);

  var dd = allowedDate.getDate(),
    mm = allowedDate.getMonth() + 1,
    yyyy = allowedDate.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + "\/" + mm + "\/" + yyyy);
};

// For start date
exports.start = function(days) {
  var today = new Date(),
    dd = today.getDate() + parseInt(days) + 1,
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
