// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// module.exports = {
//   configureWebpack: {
//     plugins: [new BundleAnalyzerPlugin()],
//   },
// };

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  // configureWebpack: {
  //   optimization: {
  //     splitChunks: {
  //       minSize: 10000,
  //       maxSize: 250000,
  //     },
  //   },
  // },
  transpileDependencies: true,
  devServer: {
    allowedHosts: [
      "localhost",
      "badmintontutor-8d444ec927af.herokuapp.com",
      "badmintontutor-backend-f45eaf6b326e.herokuapp.com",
    ],
  },
  publicPath: process.env.NODE_ENV === "prod" ? "/REPO_NAME/" : "/",
});
