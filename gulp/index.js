// Import node modules
const { src, dest, task, series, parallel } = require("gulp");
const dartSass = require("sass");
const gulpSass = require("gulp-sass");
const autoPrefixer = require("gulp-autoprefixer");
const pug = require("gulp-pug");
const webp = require("gulp-webp");
const rename = require("gulp-rename");
const webpackSteram = require("webpack-stream");
const webpack = require("webpack");
const minimist = require("minimist");
// const bump = require("gulp-bump");
// Import config
const { env, path, globs } = require("./config/config.json");
const webpackConfig = require("../webpack.config");
// Import utilities
const { end } = require("./utils/bundleLogger");
const { readJSON, createFile, cleanDir } = require("./utils/fileUtils");
const { scriptHeader, styleHeader, metaUpdate } = require("./utils/generateHeader");
const { handleErrors } = require("./utils/handleErrors");

const sass = gulpSass(dartSass);
const _dest = dest;

var argv = minimist(process.argv.slice(2));
// var releaseMode = { app: "none", view: "none" };
var base = { basename: "wayfu" };
var environment = env;

function releaseEnv() {
    return new Promise((resolve) => {
        const { mode /*, app, view */ } = argv;

        environment = mode !== undefined ? mode : environment;

        resolve();
    });
}

const webpackBundled = () => {
    const { dest, suffix } = path[environment],
        name = Object.assign({ suffix: suffix }, base);
    return src(globs.app)
        .on("error", handleErrors)
        .pipe(webpackSteram(Object.assign({ mode: environment }, webpackConfig), webpack))
        .pipe(rename(name))
        .pipe(_dest(dest))
        .on("end", end);
};

function convertImage() {
    return src("./src/images/*.png")
        .pipe(webp({ quality: 100, resize: { width: 48, height: 48 } }))
        .pipe(rename({ prefix: "wayfu-" }))
        .pipe(_dest(`./assets`));
}

function moveJson() {
    const name = Object.assign({ suffix: "-colors" }, base);

    return src("./src/jsons/*").pipe(rename(name)).pipe(_dest(`./assets`));
}

function createMetaUpdate(done) {
    if (environment !== "production") return done();

    const pkg = readJSON("package.json");

    return createFile("update.meta.js", metaUpdate(pkg))
        .pipe(rename({ basename: "update", extname: ".meta.js" }))
        .pipe(_dest("./"));
}

function cleanAssets(done) {
    if (environment !== "production") return done();
    return cleanDir("assets");
}

function clean(done) {
    if (environment !== "production") return done();
    const { dest } = path.development;
    return cleanDir(dest);
}

function compilePug() {
    const pkg = readJSON("package.json"),
        rgx = /^(?:(?:[A-Za-z\w]+)\s?[A-Za-z\w]+)/g,
        name = Object.assign({ suffix: "-view", extname: ".html" }, base);

    return src("./src/views/index.pug")
        .pipe(
            pug({
                data: {
                    author: rgx.exec(pkg.author)[0],
                    version: pkg.viewVersion,
                },
            })
        )
        .pipe(rename(name))
        .pipe(_dest(`./assets`));
}

function compileScss() {
    const isDev = environment === "development",
        name = Object.assign({ suffix: `-style${isDev ? "-dev" : ".min"}` }, base);
    return src("./src/styles/style.scss")
        .pipe(sass(isDev ? {} : { outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoPrefixer({ cascade: false }))
        .pipe(rename(name))
        .pipe(_dest(`./assets`));
}

function inserHeader() {
    const { dest } = path[environment];
    const pkg = readJSON("package.json");
    return (
        src(`${dest}*.user.js`, {
            allowEmpty: true,
        })
            // Insert userscript header
            .pipe(scriptHeader(pkg))
            // Output the file
            .pipe(_dest(dest))
    );
}

function addStyleHeader() {
    const pkg = readJSON("package.json");
    return src(`./assets/*.css`, {
        allowEmpty: true,
    })
        .pipe(styleHeader(pkg))
        .pipe(_dest(`./assets`));
}

task("createView", parallel(compilePug, convertImage, moveJson));
task("bundleStyle", series(compileScss, addStyleHeader));
task("bundleScript", series(webpackBundled, inserHeader));

task(
    "build",
    series(
        releaseEnv,
        parallel(clean, cleanAssets),
        parallel("bundleStyle", "bundleScript"),
        "createView",
        createMetaUpdate
    )
);

task("imageAssets", function imageAssets() {
    return src("./src/images/assets/*")
        .pipe(webp({ quality: 100, resize: { width: 238, height: 64 } }))
        .pipe(_dest(`./docs/assets`));
});
