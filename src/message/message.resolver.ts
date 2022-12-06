import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { MessageService } from './message.service'
import { CreateMessageInput } from './models/create-message.input'
import { MessagesInput } from './models/messages.input'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'
import { Message } from './models/message.model'
import { CurrentUser } from '../lib/decorators/user.decorator'
import { User } from '../user/models/user.model'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message], { name: 'messages'} )
  async messages(
    @Args('params') params: MessagesInput
  ) {
    console.log(`Query.messages - params: ${JSON.stringify(params)}`)
    return this.messageService.messages(params)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message, { name: 'createMessage' })
  async createMessage(
    @CurrentUser() user: User,
    @Args('params') params: CreateMessageInput
  ) {
    console.log(`Mutation.createMessage - user: ${JSON.stringify(user)}, params: ${JSON.stringify(params)}`)
    const message = await this.messageService.createMessage(user.id, params)
    await pubSub.publish('messageAdded', {
      messageAdded: message
    })
    return message;
  }

  @Subscription(() => Message, {
    name: 'messageAdded'
  })
  subscribeToMessageAdded() {
    console.log(`Subscription.subscribeToMessageAdded`)
    return pubSub.asyncIterator('messageAdded')
  }
}
