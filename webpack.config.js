/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const path = require("path")
const fs = require("fs")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const ZipPlugin = require("zip-webpack-plugin")

module.exports = (env, { mode } = {}) => ({
    mode,
    entry: {
        background: "./src/background/index.ts",
        index: "./src/index.ts",
        popup: "./src/popup.ts",
        constants: "./src/constants.ts",
        storage: "./src/storage.ts",
    },
    output: {
        publicPath: "/",
        filename: "[name].js",
        path: path.resolve(__dirname, env.browser === "firefox" ? "build-firefox" : "build"),
    },
    stats: {
        all: false,
        timings: true,
        builtAt: true,
        errors: true,
        errorDetails: true,
        performance: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    onlyCompileBundledFiles: true,
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: "local",
                                localIdentName: "[name]__[local]-[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: "svg-react-loader",
                options: {
                    name: "Icon",
                },
            },
            {
                test: /\.png$/,
                loader: "file-loader",
                options: {
                    name: "icons/[hash:hex:8].[ext]",
                },
            },
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve("src"),
        },
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/popup.html",
            filename: "popup.html",
            chunks: ["popup"],
        }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     chunkFilename: '[name]-[id].css',
        // }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: env.browser === "firefox" ? FirefoxManifest() : "./src/chrome-manifest.json",
                    to: "manifest.json",
                },
                "./src/popup.css",
                { from: "./src/icons", to: "icons" },
            ],
        }),
        ...(mode === "production"
            ? [
                  new CleanWebpackPlugin(),
                  /*new GitRevisionPlugin(),*/ new ZipPlugin({ filename: "exbo-forum-true-ignore" }),
              ]
            : []),
    ],
    watch: mode === "development",
    devtool: mode === "development" ? "inline-source-map" : "source-map",
})

function FirefoxManifest() {
    require("dotenv").config()

    const AMO_ID = process.env.AMO_ID
    const srcManifestPath = "./src/firefox-manifest.json"
    const tempManifestPath = "./temp/firefox-manifest.json"

    if (fs.existsSync("./temp") === false) {
        fs.mkdirSync("./temp")
    }

    if (AMO_ID) {
        if (fs.existsSync(tempManifestPath)) fs.rmSync(tempManifestPath)

        const srcManifest = JSON.parse(fs.readFileSync(srcManifestPath).toString())
        srcManifest.browser_specific_settings.gecko.id = AMO_ID
        srcManifest.browser_specific_settings.gecko_android.id = AMO_ID
        fs.writeFileSync(tempManifestPath, JSON.stringify(srcManifest, null, 2))
        return tempManifestPath
    } else {
        return srcManifestPath
    }
}
