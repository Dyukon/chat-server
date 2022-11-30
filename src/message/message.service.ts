import { Injectable } from '@nestjs/common'
import { CreateMessageInput } from './graphql/models/create-message.input'
import { MessagesInput } from './graphql/models/messages.input'
import { PrismaService } from '../lib/services/prisma.service'

@Injectable()
export class MessageService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async messages(params: MessagesInput) {
    return this.prismaService.message.findMany({
      where: {
        ...(params.senderId ? {senderId: params.senderId} : {}),
        ...(params.receiverId ? {receiverId: params.receiverId} : {})
      }
    })
  }

  async createMessage(params: CreateMessageInput) {
    return this.prismaService.message.create({
      data: {
        senderId: params.senderId,
        receiverId: params.receiverId,
        text: params.text
      }
    })
  }
}
