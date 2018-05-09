/* global describe, it */
'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const { expect } = require('chai')
const { group: Group } = require('../')

describe('test', () => {
  describe('group', () => {
    it('그룹 생성 (그룹 아이디 확인)', async () => {
      const group = new Group()
      await group.createGroup()
      expect(group.getGroupId()).to.not.equal(undefined)
    })
    it('그룹 생성 (agent 확인)', async () => {
      const group = new Group({ appVersion: '1.0.0' })
      await group.createGroup()
      expect(group.groupData.agent.appVersion).to.equal('1.0.0')
    })
    it('그룹 메시지 추가 (그룹 생성 전)', async () => {
      const group = new Group({ appVersion: '1.0.0' })
      try {
        await group.addGroupMessage()
      } catch (err) {
        expect(err.message).to.equal('그룹을 생성하고 사용해주세요.')
        group.err = err
      }
      expect(group.err).to.not.equal(undefined)
    })
    it('그룹 메시지 추가 (배열로)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.addGroupMessage([{
        to: '01000000000',
        from: '01000000000',
        text: 'TEST'
      }, {
        to: '01000000000',
        from: '01000000000',
        text: 'TEST'
      }])
      expect(data.errorCount).to.equal(2)
    })
    it('그룹 메시지 추가 (오브젝트로)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.addGroupMessage({
        to: '01000000000',
        from: '01000000000',
        text: 'TEST'
      })
      expect(data.errorCount).to.equal(1)
    })
  })
})
