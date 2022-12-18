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
  var data = _taggedTemplateLiteral(["\n  & > * {\n    @media not ", " {\n      :nth-child(1) {\n        display: none;\n      }\n    }\n\n    @media ", " {\n      :nth-child(2) {\n        display: none;\n      }\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
// intenionally rendering both so they don't have to remount when the query evaluation changes
// the query should omit the @media tag

var RenderToggle = function RenderToggle(_ref) {
  var _ref$query = _ref.query,
      query = _ref$query === void 0 ? '' : _ref$query,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? [] : _ref$children;
  return /*#__PURE__*/React.createElement(Toggle, {
    query: query
  }, children);
};

var Toggle = styled.section(_templateObject(), function (props) {
  return props.query;
}, function (props) {
  return props.query;
});

export default RenderToggle;
