'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.setEnvironment();

    this._server = this.getServerVars();
    this._client = this.getClientVars();
    this._localOverrides = this.getLocalOverrides();

    this._store = _Object$assign({}, this._client, this._server, this._localOverrides);
  }

  _createClass(Config, [{
    key: 'set',
    value: function set(key, value) {
      var _this = this;

      if (key.match(/:/)) {
        (function () {
          var keys = key.split(':');
          var store_key = _this._store;

          keys.forEach(function (k, i) {
            if (keys.length === i + 1) {
              store_key[k] = value;
            }

            if (store_key[k] === undefined) {
              store_key[k] = {};
            }

            store_key = store_key[k];
          });
        })();
      } else {
        this._store[key] = value;
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      // Is the key a nested object
      if (key.match(/:/)) {
        // Transform getter string into object
        var store_key = this.buildNestedKey(key);

        return store_key;
      }

      // Return regular key
      return this._store[key];
    }
  }, {
    key: 'has',
    value: function has(key) {
      return this.get(key) ? true : false;
    }
  }, {
    key: 'setEnvironment',
    value: function setEnvironment() {
      if (process.browser) {
        this._env = 'client';
      } else {
        this._env = 'server';
      }
    }
  }, {
    key: 'getServerVars',
    value: function getServerVars() {
      var serverVars = {};

      if (this._env === 'server') {
        try {
          serverVars = require('../../../config/server');
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Didn\'t find a server config in `./config`.');
          }
        }
      }

      return serverVars;
    }
  }, {
    key: 'getClientVars',
    value: function getClientVars() {
      var clientVars = undefined;

      try {
        clientVars = require('../../../config/client');
      } catch (e) {
        clientVars = {};

        if (process.env.NODE_ENV === 'development') {
          console.warn('Didn\'t find a client config in `./config`.');
        }
      }

      return clientVars;
    }
  }, {
    key: 'getLocalOverrides',
    value: function getLocalOverrides() {
      var overrides = undefined;
      var warnTemplate = 'Using local overrides in `./config/%s.js`.';

      try {
        switch (process.env.NODE_ENV) {
          case 'production':
            overrides = require('../../../config/prod');
            console.warn(warnTemplate, 'prod');
          case 'development':
            overrides = require('../../../config/dev');
            console.warn(warnTemplate, 'dev');
          case 'test':
            overrides = require('../../../config/test');
            console.warn(warnTemplate, 'test');
          default:
            overrides = require('../../../config/dev');
            console.warn('Could not match the provided NODE_ENV. Defaulting to `dev`');
        }
      } catch (e) {
        overrides = {};
      }

      return overrides;
    }

    // Builds out a nested key to get nested values
  }, {
    key: 'buildNestedKey',
    value: function buildNestedKey(nested_key) {
      // Transform getter string into object
      var keys = nested_key.split(':');
      var store_key = this._store;

      keys.forEach(function (k) {
        try {
          store_key = store_key[k];
        } catch (e) {
          return undefined;
        }
      });

      return store_key;
    }
  }]);

  return Config;
})();

var config = new Config();

exports['default'] = config;
module.exports = exports['default'];