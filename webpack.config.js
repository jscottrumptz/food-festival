const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// First, we need to create the main configuration object within our file. 
// We'll write options within this object that tell webpack what to do. 
// As of webpack version 4, a config file is not necessary, but we still want 
// to use one so that we can be more specific with how webpack will function.

module.exports = {
    // For a basic configuration, we need to provide webpack with three properties: 
    // entry, output, and mode. The first thing we want to declare is the entry property. 
    // The entry point is the root of the bundle and the beginning of the dependency graph, 
    // so give it the relative path to the client's code
    entry: {
      app: "./assets/js/script.js",
      events: "./assets/js/events.js",
      schedule: "./assets/js/schedule.js",
      tickets: "./assets/js/tickets.js"
    },

    // webpack will next take the entry point we have provided, bundle that code, and output 
    // that bundled code to a folder that we specify. It is common and best practice to put 
    // your bundled code into a folder named dist, which is short for distribution.
    output: {
      // Our build step will create a series of bundled files, one for each listing in the entry object. 
      filename: "[name].bundle.js",
      path: __dirname + "/dist",
    },
    // add the file-loader to our webpack configuration
    module: {
      rules: [
        {
          // In the config object, we added an object to the rules array. This object will identify 
          // the type of files to pre-process using the test property to find a regular expression, 
          // or regex. In our case, we are trying to process any image file with the file extension 
          // of .jpg. We could expand this expression to also search for other image file extensions 
          // such as .png, .svg, or .gif.
          test: /\.(png|jpe?g|gif)$/i,
          // Within the same object as test, we will add another property called use 
          // where the actual loader is implemented.
          use: [
            {
              loader: 'file-loader',
              // our loader has configurable options that we can designate in the webpack.config.js. 
              // For more options, look at the webpack documentation on file-loader. In this 
              // documentation, we can see there is an 'options' object that can rename our files 
              // and change the output path.
              options: {
                esModule: false,
                name(file) {
                  return '[path][name].[ext]';
                },
                publicPath: function(url) {
                  return url.replace('../', '/assets/');
                }
              }
            },
            {
              // The last step will be to use a image optimizer loader, because file-loader only 
              // emitted our images without reducing the size. We can use a package from npm called 
              // image-webpack-loader to do that.
              // Make sure we keep track of the loader dependencies and ensure that file-loader 
              // processes the images first so that image-webpack-loader can optimize the emitted files.
              loader: 'image-webpack-loader' 
            }
          ]
        }
      ]
    },
  // we need to tell webpack which plugin we want to use. We're going to use the providePlugin 
  // plugin to define the $ and jQuery variables to use the installed npm package.
  plugins:[
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    // we configured the analyzerMode property with a static value. This will output an HTML 
    // file called report.html that will generate in the dist folder. We can also set this value 
    // to disable to temporarily stop the reporting and automatic opening of this report in the browser.
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // the report outputs to an HTML file in the dist folder
    })
  ],

  // The final piece of our basic setup will provide the mode in which we want webpack to run. 
  // By default, webpack wants to run in production mode. In this mode, webpack will minify our 
  // code for us automatically, along with some other nice additions. We want our code to run in 
  // development mode.
  mode: 'development'
};