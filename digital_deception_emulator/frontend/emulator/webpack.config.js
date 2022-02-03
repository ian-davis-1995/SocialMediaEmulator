const webpack = require("webpack");
const config = {
  entry: {
    experiment: __dirname + "/src/experiment.js",
    dashboard: __dirname + "/src/dashboard.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
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
              publicPath: "/digital-deception/static/",
            },
          },
        ],
      },
    ],
  },
};
module.exports = config;
