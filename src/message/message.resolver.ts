import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MessageService } from './message.service'
import { CreateMessageInput } from './graphql/inputs/create-message.input'
import { MessagesInput } from './graphql/inputs/messages.input'

@Resolver('Message')
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService
  ) {}

  @Query()
  async messages(@Args('params') params: MessagesInput) {
    console.log(`Query.messages - params: ${JSON.stringify(params)}`)
    return this.messageService.messages(params)
  }

  @Query()
  async testTime() {
    console.log(`Query.time`)
    return new Date()
  }

  @Mutation()
  async createMessage(@Args('params') params: CreateMessageInput) {
    console.log(`Mutation.createMessage - params: ${JSON.stringify(params)}`)
    return this.messageService.createMessage(params)
  }
}
