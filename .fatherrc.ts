import * as fs from 'fs';

const basicPkgs = ['flow-graph', 'flow-nodes', 'designable'];
const packages = fs
  .readdirSync('./packages')
  .filter((pkg) => !basicPkgs.includes(pkg));

export default {
  disableTypeCheck: true,
  pkgs: basicPkgs.concat(packages),
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  cjs: {
    type: 'babel',
    lazy: true,
  },
  extraExternals: [],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      { libraryName: 'antd', libraryDirectory: 'es', style: true },
      'antd',
    ],
  ],
};
