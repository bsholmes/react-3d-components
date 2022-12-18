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

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  & > * {\n    @media not ", " {\n      display: none;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var MediaRender = function MediaRender(_ref) {
  var _ref$query = _ref.query,
      query = _ref$query === void 0 ? '' : _ref$query,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? [] : _ref$children;
  return /*#__PURE__*/React.createElement(Conditional, {
    query: query
  }, children);
};

var Conditional = styled.section(_templateObject(), function (props) {
  return props.query;
});

export default MediaRender;
