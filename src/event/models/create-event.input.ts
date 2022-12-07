import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from '@nestjs/class-validator'
import { EventType } from './event-type.model'

@InputType()
export class CreateEventInput {

  @Field(type => EventType)
  @IsNotEmpty({
    message: 'Event type cannot be empty'
  })
  type: EventType

  @Field({ nullable: true })
  receiverId: string

  @Field({ nullable: true })
  message: string
}