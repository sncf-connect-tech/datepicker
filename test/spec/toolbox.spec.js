'use strict';

var toolbox = require('../../src/js/toolbox');

describe('Test des fonctions de la toolbox du datepicker', function () {
  it('tests extendObject', function () {
    expect(toolbox.extendObject({}, {})).toEqual({});
    expect(toolbox.extendObject({a: 'a'}, {})).toEqual({a: 'a'});
    expect(toolbox.extendObject({}, {a: 'a'})).toEqual({a: 'a'});
    expect(toolbox.extendObject({a: 'a'}, {b :'b'})).toEqual({a: 'a', b: 'b'});
  });

  it('tests createElement', function () {
    var span = toolbox.createElement('<span class="class-span"></span>');

    expect(span.tagName).toBe('SPAN');
    expect(span.className).toBe('class-span');
  });
});
