import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const NODE_ENV = process.env.NODE_ENV || 'development';
const outputFolder = NODE_ENV === 'production' ? 'dist/prod/' : 'dist/dev/';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  resolve(),
  commonjs()
];

const external = id => /^react|styled-jsx|styled-components/.test(id);

export default [
  {
    input: 'src/components/PanoramaViewer.js',
    external,
    output: {
      file: outputFolder + 'PanoramaViewer.js'
    },
    plugins
  }
];
