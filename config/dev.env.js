'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ENDPOINT: '"https://private-f7289-collet.apiary-mock.com"'
  // API_ENDPOINT: '"http://localhost:18080/v1"'
})
