// export this configuration object that we're about to write here, so that webpack then can take this object and work with it.

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // entry point is where webpack will start the bundling.
  // this is the file where it will start looking for all the dependencies which it should then bundle together
  // ../: go up to the parent folder
  // ./: current folder
  entry: ["./src/js/index.js"],
  // output will tell webpack exactly where to save our bundle file.
  output: {
    // __dirname: the current absolute path.
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js"
  },
  devServer: {
    contentBase: "./dist"
  },
  // plug-ins allow us to do complex processing of our input files, and in this case of our index.html file.
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

/* 
- In webpack four we now have something called the production and the development mode.
+ The development mode simply builds our bundler without minifying our code in order to be as fast as possible.
+ The production mode will automatically enable all kinds of optimization, like minification and tree shaking in order to reduce the final bundle size. 
*/
