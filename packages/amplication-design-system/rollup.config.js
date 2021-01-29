/* eslint-disable import/no-anonymous-default-export */

import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    exports: "named",
    sourcemap: true,
  },
  plugins: [
    typescript(),
    postcss({
      inject: {
        insertAt: "top", //inject the css at the top to allow overrides to be located below
      },
    }),
    copy({
      targets: [{ src: "src/assets/**", dest: "dist/assets", flatten: false }],
    }),
  ],
  external: Object.keys(pkg.dependencies).concat(
    Object.keys(pkg.peerDependencies)
  ),
};
