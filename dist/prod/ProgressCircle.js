import React from 'react';
import styled from 'styled-components/macro';

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var clamp = function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

var grey = '#DDDDDD';
var brightBlue = '#2170EF';

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: -", ";\n  left: -", ";\n\n  border: ", " solid ", ";\n  border-radius: 50%;\n\n  clip-path: polygon(0 0, 50% 0, 50% calc(", " + ", " * 2), 0 calc(", " + ", " * 2));\n  transform: rotate(", "deg) scaleX(-1);\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: -", ";\n  left: -", ";\n\n  border: ", " solid ", ";\n  border-radius: 50%;\n\n  clip-path: polygon(0 0, 50% 0, 50% calc(", " + ", " * 2), 0 calc(", " + ", " * 2));\n  transform: rotate(", "deg);\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n\n  clip-path: inset(-", " 50% -", " -", ");\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n\n  clip-path: inset(-", " -", " -", " 50%);\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  position: relative;\n  width: ", ";\n  height: ", ";\n\n  border: ", " solid ", ";\n  border-radius: 50%;\n\n  box-sizing: border-box;\n\n  margin: auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var DEFAULT_SIZE = '64px';
var DEFAULT_BAR_WIDTH = '10px';
var DEFAULT_BAR_COLOR = brightBlue;
var DEFAULT_BAR_BG_COLOR = grey;

var ProgressCircle = function ProgressCircle(_ref) {
  var _ref$percent = _ref.percent,
      percent = _ref$percent === void 0 ? 0 : _ref$percent,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? DEFAULT_SIZE : _ref$size,
      _ref$barWidth = _ref.barWidth,
      barWidth = _ref$barWidth === void 0 ? DEFAULT_BAR_WIDTH : _ref$barWidth,
      _ref$barColor = _ref.barColor,
      barColor = _ref$barColor === void 0 ? DEFAULT_BAR_COLOR : _ref$barColor,
      _ref$barBGColor = _ref.barBGColor,
      barBGColor = _ref$barBGColor === void 0 ? DEFAULT_BAR_BG_COLOR : _ref$barBGColor,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? function () {} : _ref$onClick,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? [] : _ref$children;
  return /*#__PURE__*/React.createElement(StatusBorder, {
    size: size,
    barWidth: barWidth,
    barBGColor: barBGColor // TODO: compute the percent clicked based on polar coordinates and return as part of the event
    ,
    onClick: onClick
  }, /*#__PURE__*/React.createElement(StatusBarRightClip, {
    barWidth: barWidth
  }, /*#__PURE__*/React.createElement(StatusBarRight, {
    percent: percent,
    barColor: barColor,
    size: size,
    barWidth: barWidth
  })), /*#__PURE__*/React.createElement(StatusBarLeftClip, {
    barWidth: barWidth
  }, /*#__PURE__*/React.createElement(StatusBarLeft, {
    percent: percent,
    barColor: barColor,
    size: size,
    barWidth: barWidth
  })), children);
};

var StatusBorder = styled.div(_templateObject(), function (props) {
  return props.size;
}, function (props) {
  return props.size;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barBGColor;
});
var StatusBarRightClip = styled.div(_templateObject2(), function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
});
var StatusBarLeftClip = styled.div(_templateObject3(), function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
});
var StatusBarRight = styled.div(_templateObject4(), function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barColor;
}, function (props) {
  return props.size;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.size;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return clamp(props.percent * 2, 0, 1) * 180;
});
var StatusBarLeft = styled.div(_templateObject5(), function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.barColor;
}, function (props) {
  return props.size;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return props.size;
}, function (props) {
  return props.barWidth;
}, function (props) {
  return clamp((props.percent - 0.5) * 2, 0, 1) * 180;
});
ProgressCircle.propTypes = {
  /**
    a floating point number between 0 and 1
  */
  percent: propTypes.number,

  /**
    overall width and height string including CSS units.
    This solution only works with a square aspect
  */
  size: propTypes.string,

  /**
    bar width string including CSS units
  */
  barWidth: propTypes.string,

  /**
    bar color as a hex string
  */
  barColor: propTypes.string,

  /**
    Background bar color as a hex string
  */
  barBGColor: propTypes.string
};
ProgressCircle.displayName = 'ProgressCircle';

export default ProgressCircle;
