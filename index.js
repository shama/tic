/*
 * tic
 * https://github.com/shama/tic
 *
 * Copyright (c) 2014 Kyle Robinson Young
 * Licensed under the MIT license.
 */

var now = (function() {
  var p = window.performance || Object.create(null);
  return function() {
    var n = p.now || p.webkitNow || p.mozNow || p.msNow || p.oNow || function() { return (new Date()).getTime() };
    return n.call(p);
  }
}());

function Tic() {
  this._things = [];
  this._dt = -1;
}
module.exports = function() { return new Tic(); };

Tic.prototype._stack = function(thing) {
  var self = this;
  self._things.push(thing);
  var i = self._things.length - 1;
  return function() { delete self._things[i]; }
};

Tic.prototype.interval = Tic.prototype.setInterval = function(fn, at) {
  return this._stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: false
  });
};

Tic.prototype.timeout = Tic.prototype.setTimeout = function(fn, at) {
  return this._stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: true
  });
};

Tic.prototype.tick = function(dt) {
  var self = this;
  if (arguments.length < 1) {
    var t = now()
    if (this._dt < 0) this._dt = t
    dt = t - this._dt
    this._dt = t
  }
  self._things.forEach(function(thing, i) {
    thing.elapsed += dt;
    if (thing.elapsed > thing.at) {
      thing.elapsed -= thing.at;
      thing.fn.apply(thing.fn, thing.args || []);
      if (thing.once) {
        delete self._things[i];
      }
    }
  });
};
