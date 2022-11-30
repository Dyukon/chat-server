import { Injectable } from '@nestjs/common'
import { CreateMessageInput } from './graphql/inputs/create-message.input'
import { MessagesInput } from './graphql/inputs/messages.input'

@Injectable()
export class MessageService {

  async messages(params: MessagesInput) {
    return []
  }

  async createMessage(params: CreateMessageInput) {
    return null
  }
}
