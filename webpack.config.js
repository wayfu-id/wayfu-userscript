const path = require("path");

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
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "babel-loader",
                exclude: /(node_modules)/,
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-typescript"],
                },
            },
        ],
    },
    externals: {
        "@wayfu/simple-wapi": "WAPI",
        "@wayfu/simple-xlsx": "XLSX",
        "@wayfu/wayfu-dom": "DOM",
        "@wayfu/waydown": "Waydown",
        react: "React",
        "react-dom": "ReactDOM",
    },
    target: ["web", "es5"],
};
