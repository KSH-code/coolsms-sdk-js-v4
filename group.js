'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const os = require('os')
const { asyncRequest } = require('./utils')
const { getAuth } = require('./config')

module.exports = class Group {
  constructor (agent = {}) {
    if (!agent) throw new Error('agent는 object 타입 이어야 됩니다.')
    this.agent = agent
    this.agent.osPlatform = os.platform()
    this.agent.sdkVersion = 'JS 4.0.0'
  }
  async createGroup () {
    if (this.groupId) return
    this.groupData = await asyncRequest('post', 'https://rest.coolsms.co.kr/messages/v4/groups', { headers: { Authorization: getAuth() }, form: this.agent })
    this.groupId = this.groupData.groupId
  }
  async addGroupMessage (messages) {
    if (!this.getGroupId()) throw new Error('그룹을 생성하고 사용해주세요.')
    if (!Array.isArray(messages)) messages = [messages]
    messages = JSON.stringify(messages)
    const data = await asyncRequest('put', `https://rest.coolsms.co.kr/messages/v4/groups/${this.groupId}/messages`, { headers: { Authorization: getAuth() }, form: { messages } })
    return data
  }
  getGroupId () {
    return this.groupId
  }
}
