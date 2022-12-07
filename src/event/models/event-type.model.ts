import { registerEnumType } from '@nestjs/graphql'

export enum EventType {
  JOIN = 'join',
  MESSAGE = 'message',
  LEAVE = 'leave'
}

registerEnumType(EventType, {
  name: 'EventType'
})