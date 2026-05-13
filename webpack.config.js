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
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
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
        "react-dom/client": "ReactDOM",
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
    target: ["web", "es5"],
};
