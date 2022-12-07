import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional } from '@nestjs/class-validator'
import { EventType } from './event-type.model'

@InputType()
export class EventsInput {

  @Field(type => EventType, { nullable: true })
  @IsOptional()
  type: EventType

  @Field({ nullable: true })
  @IsOptional()
  senderId: string

  @Field({ nullable: true })
  @IsOptional()
  receiverId: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDate({
    message: 'Start date must be date'
  })
  startDate: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate({
    message: 'Finish date must be date'
  })
  finishDate: Date
}