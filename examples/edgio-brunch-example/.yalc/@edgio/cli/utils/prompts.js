"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmOrExit = confirmOrExit;
exports.default = void 0;
exports.yesNoQuestion = yesNoQuestion;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const prompts = require('prompts');

const defaultOptions = {
  onCancel: () => process.exit(1)
};

async function yesNoQuestion(message, {
  initial = true
} = {}) {
  const {
    confirmed
  } = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial
  });
  return confirmed;
}

async function confirmOrExit(message, {
  initial = true
} = {}) {
  const confirmed = await yesNoQuestion(message, {
    initial
  });

  if (!confirmed) {
    process.exit(0);
  }
}

var _default = (questions, options = {}) => prompts(questions, _objectSpread(_objectSpread({}, defaultOptions), options));

exports.default = _default;