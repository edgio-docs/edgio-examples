"use strict";

const WebSocket = require('ws');

const EventEmitter = require('events');

const url = require('url');

class Sockets {
  constructor(channel, apiUrl) {
    this.channel = channel;
    this.origin = apiUrl;
    this.events = new EventEmitter();
  }
  /**
   * Connect to WS server
   */


  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this._cableUrl, {
        origin: this.origin,
        followRedirects: true
      });
      this.ws.on('error', err => {
        reject(err);
        this.close();
      });
      this.ws.on('open', async () => {
        await this.subscribe(resolve, reject);
      });
    });
  }
  /**
   * Subscribe and start listening for events
   * @param {*} resolve Promise resolve - once connected
   * @param {*} reject Promise reject - once closed
   */


  subscribe(resolve, reject) {
    this.ws.send(JSON.stringify({
      command: 'subscribe',
      identifier: this._identifier
    }));
    this.ws.on('message', message => {
      const msg = JSON.parse(message);

      if (msg.type === 'confirm_subscription') {
        this.events.emit('connected');
        resolve();
      } else if (msg.type === 'reject_subscription') {
        reject(msg.type);
        this.close();
      } else if (!msg.type && msg.message.action) {
        this.events.emit(msg.message.action, msg.message);
      }
    });
  }
  /**
   * Emit event to ws server
   * @param {*} action String - This is the function that will be called in rails. If undefinded check rails logs
   * @param {*} data
   */


  emit(action, data = {}) {
    this._send('message', {
      data: JSON.stringify(data),
      action: action
    });

    return this;
  }
  /**
   * Listen For Events
   * @param {String} event
   * @param {Function} callback
   */


  on(event, callback) {
    this.events.on(event, callback);
    return this;
  }
  /**
   * Closes Socket Server
   */


  close() {
    this.ws.close();
  }
  /**
   * Sends event thru ws
   * @param {String} command // message/subscribe
   * @param {*} data
   */


  _send(command, data) {
    this.ws.send(JSON.stringify({
      command,
      identifier: this._identifier,
      data: JSON.stringify(data)
    }));
  }
  /**
   * Returns message identifier
   */


  get _identifier() {
    return JSON.stringify({
      channel: this.channel
    });
  }
  /**
   * Returns Cable Url
   */


  get _cableUrl() {
    const u = url.parse(this.origin);
    u.protocol = u.protocol.indexOf('https') !== -1 ? 'wss' : 'ws';
    u.pathname = '/cable';
    return url.format(u);
  }

}

module.exports = Sockets;