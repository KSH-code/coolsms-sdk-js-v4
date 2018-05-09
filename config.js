'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const moment = require('moment')
const uniqid = require('uniqid')
const HmacSHA256 = require('crypto-js/hmac-sha256')
const config = require('./config.json')
const { apiKey = process.env.apiKey, apiSecret = process.env.apiSecret, accessToken = process.env.accessToken } = config

module.exports = {
  getAuth () {
    const date = moment.utc().format()
    const salt = uniqid()
    const hmacData = date + salt
    const signature = HmacSHA256(hmacData, apiSecret).toString()
    if (apiKey && apiSecret) return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
    else return `Bearer ${accessToken}`
  }
}
