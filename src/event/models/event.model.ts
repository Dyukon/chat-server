import { Field, ID, ObjectType } from '@nestjs/graphql'
import { EventType } from './event-type.model'

@ObjectType()
export class Event {

  @Field(type => ID)
  id: string

  @Field(type => EventType)
  type: EventType

  @Field(type => Date)
  createdAt: Date

  @Field()
  senderId: string

  @Field()
  senderName: string

  @Field({ nullable: true })
  receiverId: string

  @Field({ nullable: true })
  message: string
}