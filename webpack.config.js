const path = require("path");

const isStorybook = process.env.STORYBOOK === "true";

module.exports = {
    entry: "./index.ts",
    devtool: false,
    output: {
        clean: true,
        chunkFormat: "module",
        chunkLoading: "import",
        iife: false,
        environment: {
            arrowFunction: true,
            bigIntLiteral: false,
            const: true,
            destructuring: true,
            dynamicImport: false,
            forOf: true,
            module: false,
            optionalChaining: true,
            templateLiteral: true,
        },
    },
    context: path.resolve(__dirname, "src"),
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
                exclude: /(node_modules)/,
                options: {
                    presets: [
                        "@babel/preset-env",
                        ["@babel/preset-react", { runtime: "classic" }],
                        "@babel/preset-typescript",
                    ],
                },
            },
        ],
    },
    externals: isStorybook
        ? {}
        : [
              {
                  "@wayfu/simple-wapi": "WAPI",
                  "@wayfu/simple-xlsx": "XLSX",
                  "@wayfu/wayfu-dom": "DOM",
                  "@wayfu/waydown": "Waydown",
                  // react: "React",
                  // "react-dom/client": "ReactDOM",
                  // Change these from string to factory
                  // react: {
                  //     commonjs: "react",
                  //     commonjs2: "react",
                  //     // This tells webpack: grab it from window.React at runtime
                  //     root: ["React"],
                  // },
                  // "react-dom/client": {
                  //     // This tells webpack: grab it from window.ReactDOM at runtime
                  //     root: ["ReactDOM"],
                  // },
              },
              function ({ request }, callback) {
                  const moduleMap = {
                      react: "React",
                      "react-dom": "ReactDOM",
                      "react-dom/client": "ReactDOM",
                  };

                  const requireKey = moduleMap[request];
                  if (requireKey) {
                      // Emit exactly this expression as the module value.
                      // "commonjs-module" tells Webpack the result is a CJS module,
                      // so default imports and named imports both resolve correctly.
                      return callback(null, `unsafeWindow.require("${requireKey}")`);
                  }

                  // Everything else is bundled normally
                  callback();
              },
          ],
    target: ["web", "es5"],
};
