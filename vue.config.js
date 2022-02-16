const Components = require('unplugin-vue-components/webpack')
const {VarletUIResolver} = require('unplugin-vue-components/resolvers')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "components": "@/components",
        "views": "@/views",
      }
    },
    plugins: [
      Components({
        resolvers: [VarletUIResolver()]
      })
    ]
  }
}
