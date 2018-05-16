'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CLIENT_ENDPOINT: '"http://localhost:8080"',
  API_ENDPOINT: '"http://localhost:9000/v1"'
})
