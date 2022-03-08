
/**
 * Module dependencies.
 */

var Socket = require('./sock');
var slice = require('../utils').slice;
var queue = require('../plugins/queue');

/**
 * Expose `PubSocket`.
 */

module.exports = PubSocket;

/**
 * Initialize a new `PubSocket`.
 *
 * @api private
 */

function PubSocket() {
  Socket.call(this);

  var self = this;

  this.ready = false;
  this.use(queue());

  function ready() {
    self.ready = true;
  }

  this.on('bind', ready);
  this.on('connect', ready);
}

/**
 * Inherits from `Socket.prototype`.
 */

PubSocket.prototype.__proto__ = Socket.prototype;

/**
 * Send `msg` to all established peers.
 *
 * @param {Mixed} msg
 * @api public
 */

PubSocket.prototype.send = function(msg){
  var socks = this.socks;
  var len = socks.length;
  var sock;

  if (!this.ready) return this.enqueue(slice(arguments));

  var buf = this.pack(arguments);

  for (var i = 0; i < len; i++) {
    sock = socks[i];
    if (sock.writable) sock.write(buf);
  }

  return this;
};
