const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
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
