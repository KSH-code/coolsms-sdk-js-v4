/* global describe, it */
'use strict'

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const { expect } = require('chai')
const { group: Group } = require('../')
const { getAuth, getPhoneNumber } = require('../config')

describe('test', () => {
  describe('config', () => {
    it('API_KEY, API_SECRET 검사', done => {
      expect(getAuth(1)).to.match(/^HMAC-SHA256/)
      done()
    })
    it('ACCESS_TOKEN 검사', done => {
      expect(getAuth(2)).to.match(/^Bearer/)
      done()
    })
    it('default 검사', done => {
      try {
        getAuth(0)
      } catch (err) {
        expect(err.message).to.equal('문자메시지를 전송하기 위해서는 액세스토큰 또는 API_KEY, API_SECRET이 필요합니다.')
        done()
      }
    })
  })
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
    it('그룹 메시지 발송 (성공)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      expect(data.errorCount).to.equal(0)
      expect(await group.sendMessages()).to.deep.equal({})
    })
    it('그룹 삭제 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await group.deleteGroup()
      expect(data.log[1].message).to.match(/삭제/)
    })
    it('그룹 삭제 (PENDING 이 아닌경우)', async () => {
      const group = new Group()
      await group.createGroup()
      await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      expect(await group.sendMessages()).to.deep.equal({})
      let data = {}
      try {
        await group.deleteGroup()
      } catch (err) {
        data = err
      }
      expect(data.errorCode).to.equal('ResourceNotFound')
      expect(data.errorMessage).to.equal('해당 그룹에 메시지가 존재하지 않습니다.')
    })
    it('그릅 정보 조회 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      const data = await Group.getInfo(group)
      expect(data).to.have.all.keys('agent', 'count', 'log', 'status', '_id', 'groupId', 'accountId', 'apiVersion')
    })
    it('그릅 정보 조회 (생성 전)', async () => {
      const group = new Group()
      let data = {}
      try {
        await Group.getInfo(group)
      } catch (err) {
        data = err
      }
      expect(data.message).to.equal('그룹을 생성하고 사용해주세요.')
    })
  })
  describe('message', () => {
    it('메시지 리스트 조회 (그룹 생성 전)', async () => {
      const group = new Group()
      let data = {}
      try {
        await group.getMessageList()
      } catch (err) {
        data = err
      }
      expect(data.message).to.equal('그룹을 생성하고 사용해주세요.')
    })
    it('메시지 리스트 조회 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      const data = await group.getMessageList()
      expect(data).to.have.lengthOf(2)
    })
    it('메시지 조회 (정상)', async () => {
      const group = new Group()
      await group.createGroup()
      await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      await group.addGroupMessage({
        to: getPhoneNumber(),
        from: getPhoneNumber(),
        text: 'TEST'
      })
      const data = await group.getMessageList()
      expect(data).to.have.lengthOf(2)
    })
  })
})
