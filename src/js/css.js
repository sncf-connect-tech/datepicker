(function () {

  // CSS CLASS FUNCTIONS
  // To use on one or several elements

  exports.addClass = function (el, name) {
    if (typeof el !== 'object') { return; }
    if (el === null) { return; }
    if (typeof name !== 'string') { return; }
    if (name === null) { return; }

    var i = 0;
    var l = 0;

    if (typeof el.className !== 'undefined') {
      var regex = getRegex(name);
      for (i = 0, l = regex.length; i < l; i++) {
        if (el.className.match(regex[i])) {
          return;
        }
      }
      el.className = el.className + ' ' + name;
    } else if (el[0] && el[0].className) {
      for (i = 0, l = el.length; i < l; i++) {
        this.addClass(el[i], name);
      }
    }
  };

  exports.removeClass = function (el, name) {
    if (typeof el !== 'object') { return; }
    if (el === null) { return; }
    if (typeof name !== 'string') { return; }
    if (name === null) { return; }

    var i = 0;
    var l = 0;

    if (typeof el.className !== 'undefined') {
      var regex = getRegex(name);
      for (i = 0, l = regex.length; i < l; i++) {
        el.className = el.className.replace(regex[i], ' ');
      }
    } else if (el[0] && el[0].className) {
      for (i = 0, l = el.length; i < l; i++) {
        this.removeClass(el[i], name);
      }
    }
  };

  exports.toggleClass = function (el, name) {
    if (typeof el !== 'object') { return; }
    if (el === null) { return; }
    if (typeof name !== 'string') { return; }
    if (name === null) { return; }

    var i = 0;
    var l = 0;

    if (typeof el.className !== 'undefined') {
      var regex = getRegex(name);
      var match = false;
      for (i = 0, l = regex.length; i < l; i++) {
        if (el.className.match(regex[i])) {
          match = true;
          break;
        }
      }
      if (match) {
        this.removeClass(el, name);
      } else {
        this.addClass(el, name);
      }
    } else if (el[0] && el[0].className) {
      for (i = 0, l = el.length; i < l; i++) {
        this.toggleClass(el[i], name);
      }
    }
  };

  exports.hasClass = function (el, name) {
    if (typeof el !== 'object') { return; }
    if (el === null) { return; }
    if (typeof name !== 'string') { return; }
    if (name === null) { return; }

    var i = 0;
    var l = 0;
    var hasClass = true;

    if (typeof el.className !== 'undefined') {
      hasClass = false;
      var regex = getRegex(name);
      for (i = 0, l = regex.length; i < l; i++) {
        hasClass = el.className.match(regex[i]);
        if (hasClass) {
          break;
        }
      }
    } else if (el[0] && el[0].className) {
      for (i = 0, l = el.length; i < l; i++) {
        hasClass = (this.hasClass(el[i], name));
        if (!hasClass) {
          break;
        }
      }
    }

    return hasClass;
  };

  function getRegex(name) {
    var only = new RegExp('^' + name + '$');
    var beginwith = new RegExp('^' + name + '\\s+');
    var endwith = new RegExp('\\s+' + name + '$');
    var middle = new RegExp('\\s+' + name + '\\s+');
    return [only, beginwith, endwith, middle];
  }
})();
