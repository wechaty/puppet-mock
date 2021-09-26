import { EventEmitter }   from 'events'
import type TypedEventEmitter  from 'typed-emitter'

import type {
  ContactMock,
  MessageMock,
}                   from '../user/mod.js'

export type ContactMessageEventListener = (this: ContactMock, message: MessageMock, date?: Date) => void

interface ContactEvents {
  message    : ContactMessageEventListener,
}

export const ContactEventEmitter = EventEmitter as new () => TypedEventEmitter<
  ContactEvents
>
