#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

import type {
  Message,
}                 from 'wechaty'
import {
  WechatyBuilder,
}                 from 'wechaty'
import type {
  ContactMock,
  RoomMock,
}                 from '../src/mock/mod.js'

import {
  PuppetMock,
  mock,
}                         from '../src/mod.js'

async function * wechatyFixture () {
  const mocker  = new mock.Mocker()
  const puppet  = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  try {
    await wechaty.start()

    yield {
      mocker,
      wechaty,
    }

  } finally {
    await wechaty.stop()
  }
}

test('integration testing', async t => {
  const mocker = new mock.Mocker()
  const puppet = new PuppetMock({ mocker })
  const wechaty = WechatyBuilder.build({ puppet })

  t.ok(wechaty, 'should instantiate wechaty with puppet mocker')
})

test('Contact.find() mocker.createContacts()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of wechatyFixture()) {
    const CONTACTS_NUM = 5
    const [user, mike] = mocker.createContacts(CONTACTS_NUM) as [ContactMock, ContactMock]
    mocker.login(user)

    const contactList = await wechaty.Contact.findAll()
    t.equal(contactList.length, CONTACTS_NUM, 'should find all contacts create by mocker')

    const contact = await wechaty.Contact.find({ name: mike.payload.name })
    t.ok(contact, 'should find a contact by name of mike')
    t.equal(contact!.id, mike.id, 'should find the contact the same id as mike')
  }
})

test('Room.find() mocker.createRooms()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of wechatyFixture()) {
    const user = mocker.createContact()
    mocker.login(user)

    const ROOMS_NUM = 5
    const [starbucks] = mocker.createRooms(ROOMS_NUM) as [RoomMock]

    const roomList = await wechaty.Room.findAll()
    t.equal(roomList.length, ROOMS_NUM, 'should find all rooms create by mocker')

    const room = await wechaty.Room.find({ topic: starbucks.payload.topic })
    t.ok(room, 'should find a room by topic of starbucks')
    t.equal(room!.id, starbucks.id, 'should find the room the same id as starbucks')
  }
})

test('Contact.load() mocker.createContact()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of wechatyFixture()) {

    const user = mocker.createContact()
    mocker.login(user)

    const FILE_HELPER_ID = 'filehelper'

    const filehelper = mocker.createContact({
      id: FILE_HELPER_ID,
    })

    const contact = await wechaty.Contact.find({ id: FILE_HELPER_ID })
    if (!contact) {
      throw new Error('no contact')
    }
    t.ok(contact, 'should load contact by id')
    t.equal(contact!.id, filehelper.id, 'should load contact with id the same as filehelper')

    t.same(contact.name(), filehelper.payload.name, 'should match the payload name between wechaty contact & mock contact')
  }
})

test('Room.load() mocker.createRoom()', async t => {
  for await (const {
    mocker,
    wechaty,
  } of wechatyFixture()) {

    const user = mocker.createContact()
    mocker.login(user)

    const starbucks = mocker.createRoom()

    const room = await wechaty.Room.find({ id: starbucks.id })
    if (!room) {
      throw new Error('no room')
    }

    t.ok(room, 'should load room by id')
    t.equal(room!.id, starbucks.id, 'should load room with id the same as starbucks')

    t.same(await room.topic(), starbucks.payload.topic, 'should match the payload topic between wechaty room & mock room')
  }
})

test('Wechaty bot can receive message sent from mocker', async t => {
  for await (const {
    mocker,
    wechaty,
  } of wechatyFixture()) {
    await wechaty.start()

    const bot    = mocker.createContact({ name: 'Bot' })
    const player = mocker.createContact({ name: 'Player' })

    mocker.login(bot)
    const wechatyUserSelf = wechaty.currentUser

    const directMessage = await new Promise<Message>(resolve => {
      wechatyUserSelf.once('message', resolve)
      player.say().to(bot)
    })
    t.ok(directMessage, 'should resolve a message')
    await new Promise(setImmediate)
  }
})
