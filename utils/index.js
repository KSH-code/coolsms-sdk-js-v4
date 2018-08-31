'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const request = require('request')
const { getAuth } = require('../config')

function asyncRequest (method, uri, data = {}) {
  data.headers = { Authorization: getAuth() }
  return new Promise((resolve, reject) => {
    request[method](uri, data, (err, res) => {
      res.body = JSON.parse(res.body || '{}')
      if (err || res.statusCode !== 200) reject(err || res.body)
      resolve(res.body)
    })
  })
}

module.exports = {
  asyncRequest
}
