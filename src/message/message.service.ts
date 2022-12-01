import { Injectable } from '@nestjs/common'
import { CreateMessageInput } from './models/create-message.input'
import { MessagesInput } from './models/messages.input'
import { PrismaService } from '../lib/services/prisma.service'

@Injectable()
export class MessageService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async messages(params: MessagesInput) {
    let dateFilter = {
      ...(params.startDate ? {gte: params.startDate} : {}),
      ...(params.finishDate ? {lt: params.finishDate} : {})
    }
    return await this.prismaService.message.findMany({
      where: {
        ...(params.senderId ? {senderId: params.senderId} : {}),
        ...(params.receiverId ? {receiverId: params.receiverId} : {}),
        ...(params.startDate || params.finishDate ? {createdAt: dateFilter} : {})
      }
    })
  }

  async createMessage(senderId: string, params: CreateMessageInput) {
    return this.prismaService.message.create({
      data: {
        senderId: senderId,
        receiverId: params.receiverId,
        text: params.text
      }
    })
  }
}
