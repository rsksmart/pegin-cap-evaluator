import rollupPluginCommonjs from 'rollup-plugin-commonjs';
import rollupPluginResolve from 'rollup-plugin-node-resolve';
import rollupPluginJson from "rollup-plugin-json"

const config = {
  input: 'src/pegin-cap-evaluator.js',
  output: {
    file: 'dist/pegin-cap-evaluator.umd.js',
    format: 'umd',
    name: 'RskPegInCapEvaluator',
  },
  plugins: [
    rollupPluginCommonjs(),
    rollupPluginResolve(),
    rollupPluginJson()
  ],
};

export default config;