const alias = [
  'object-assign',
  'whatwg-fetch',
  '@babel/polyfill',
  'classnames',
  'history',
  'hoist-non-react-statics',
  'immutable',
  'invariant',
  'moment',
  'react',
  'react-copy-to-clipboard',
  'react-dnd',
  'react-dnd-html5-backend',
  'react-dom',
  // 불필요한 코드 제거함 (Usage log 전송 기능)
  //'react-ga',
  'react-helmet',
  'react-loadable',
  'react-redux',
  'react-router',
  'react-router-dom',
  'react-transition-group',
  'reactstrap',
  'redux',
  'redux-immutable',
  'remove-markdown',
  'reselect',
  'styled-components',
];

module.exports = alias.reduce((acc, curr) => {
  acc[curr] = require.resolve(curr);

  return acc;
}, {});
