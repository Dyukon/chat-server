import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsOptional } from '@nestjs/class-validator'

@InputType()
export class MessagesInput {

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