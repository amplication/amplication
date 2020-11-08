import path from "path";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const extensions = [".ts", ".tsx", ".js", ".jsx"];

export default [
  {
    input: "src/index.ts",
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      babel({
        babelHelpers: "runtime",
        configFile: path.resolve(__dirname, "babel.config.json"),
        extensions,
      }),
      commonjs({ extensions }),
      postcss(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      babel({
        babelHelpers: "runtime",
        configFile: path.resolve(__dirname, "babel.config.commonjs.json"),
        extensions,
      }),
      commonjs({ extensions }),
      postcss(),
    ],
  },
];
