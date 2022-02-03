const webpack = require("webpack");
const config = {
  entry: {
    index: __dirname + "/src/index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/digital-deception/rspan/static",
            },
          },
        ],
      },
    ],
  },
};
module.exports = config;
