/**
 * Return the current date
 */
exports.current = function () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + '\/' + mm + '\/' + yyyy);
};

exports.backward = function () {
  var THIRTY_DAYS = 90 * 24 * 60 * 60 * 1000;
  var thirtyDaysFromNow = new Date(new Date() - THIRTY_DAYS);
  var dd = thirtyDaysFromNow.getDate();
  var mm = thirtyDaysFromNow.getMonth() + 1;
  var yyyy = thirtyDaysFromNow.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + '\/' + mm + '\/' + yyyy);
};

// For 6 months limitation
exports.sixMonthsFuture = function () {
  var allowedDate = new Date();

  allowedDate.setMonth(allowedDate.getMonth() + 6);

  var dd = allowedDate.getDate();
  var mm = allowedDate.getMonth() + 1;
  var yyyy = allowedDate.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + '\/' + mm + '\/' + yyyy);
};

// For UK Railpass
exports.railpassMin = function () {
  var allowedDate = new Date();

  allowedDate.setDate(allowedDate.getDate() + 7);

  var dd = allowedDate.getDate();
  var mm = allowedDate.getMonth() + 1;
  var yyyy = allowedDate.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + '\/' + mm + '\/' + yyyy);
};

// For start date
exports.start = function (days) {
  var today = new Date();
  var dd = today.getDate() + parseInt(days) + 1;
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return String(dd + '\/' + mm + '\/' + yyyy);
};