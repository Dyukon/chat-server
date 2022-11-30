import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MessageService } from './message.service'
import { CreateMessageInput } from './graphql/models/create-message.input'
import { MessagesInput } from './graphql/models/messages.input'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'

@Resolver('Message')
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query()
  async messages(@Args('params') params: MessagesInput) {
    console.log(`Query.messages - params: ${JSON.stringify(params)}`)
    return this.messageService.messages(params)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async createMessage(@Args('params') params: CreateMessageInput) {
    console.log(`Mutation.createMessage - params: ${JSON.stringify(params)}`)
    return this.messageService.createMessage(params)
  }
}
