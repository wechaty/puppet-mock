import { EventEmitter }   from 'events'
import type TypedEventEmitter  from 'typed-emitter'

import type {
  // ContactMock,
  MessageMock,
  RoomMock,
}                   from '../user/mod.js'

// export type RoomInviteEventListener  = (this: Room, inviter: Contact, invitation: RoomInvitation)                   => void
// export type RoomJoinEventListener    = (this: Room, inviteeList: Contact[], inviter: Contact,  date?: Date)         => void
// export type RoomLeaveEventListener   = (this: Room, leaverList: Contact[], remover?: Contact, date?: Date)          => void
export type RoomMessageEventListener = (this: RoomMock, message: MessageMock, date?: Date) => void
// export type RoomTopicEventListener   = (this: Room, topic: string, oldTopic: string, changer: Contact, date?: Date) => void

interface RoomEvents {
  // invite  : RoomInviteEventListener
  // join    : RoomJoinEventListener,
  // leave   : RoomLeaveEventListener,
  message : RoomMessageEventListener,
  // topic   : RoomTopicEventListener,
}

export const RoomEventEmitter = EventEmitter as new () => TypedEventEmitter<
  RoomEvents
>
