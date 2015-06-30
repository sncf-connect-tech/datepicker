exports.extendObject = function(initObj, obj) {
  var i = '';
  for (i in obj) {
    initObj[i] = obj[i];
  }
  return initObj;
};

exports.emptyNode = function(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
  return node;
};

exports.createElement = function (str) {
  var elt = document.createElement("div");
  elt.innerHTML = str;
  return elt.firstChild;
};
