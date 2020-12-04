// Enable ts-node
require("ts-node").register({
  transpileOnly: false,
  compilerOptions: {
    module: "commonjs",
    target: "esnext",
  },
})
require('tsconfig-paths').register()
require('dotenv').config({
  path: ".env"
})

// Configure
module.exports = require('./gatsby-config.ts')
