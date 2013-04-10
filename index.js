/*
 * tic
 * https://github.com/shama/tic
 *
 * Copyright (c) 2013 Kyle Robinson Young
 * Licensed under the MIT license.
 */

var tic = module.exports = {};
var things = [];

function stack(thing) {
  things.push(thing);
  var i = things.length - 1;
  return function() { delete things[i]; }
}

tic.interval = tic.setInterval = function(fn, at) {
  return stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: false
  });
};

tic.timeout = tic.setTimeout = function(fn, at) {
  return stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: true
  });
};

tic.tick = function(dt) {
  things.forEach(function(thing, i) {
    thing.elapsed += dt;
    if (thing.elapsed > thing.at) {
      thing.elapsed -= thing.at;
      thing.fn.apply(thing.fn, thing.args || []);
      if (thing.once) {
        delete things[i];
      }
    }
  });
};
