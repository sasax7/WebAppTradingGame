const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "../public",
  assetsDir: "static",
  devServer: {
    proxy: "http://localhost:9000",
  },
});
