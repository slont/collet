'use strict'

const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  CLIENT_ENDPOINT: '"http://localhost:8080"',
  API_ENDPOINT: '"http://localhost:18080/v1"'
})
