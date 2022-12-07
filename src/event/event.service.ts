import { Injectable } from '@nestjs/common'
import { CreateEventInput } from './models/create-event.input'
import { EventsInput } from './models/events.input'
import { PrismaService } from '../lib/services/prisma.service'

@Injectable()
export class EventService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async events(params: EventsInput) {
    let dateFilter = {
      ...(params.startDate ? {gte: params.startDate} : {}),
      ...(params.finishDate ? {lt: params.finishDate} : {})
    }
    return this.prismaService.event.findMany({
      where: {
        ...(params.type ? {type: params.type} : {}),
        ...(params.senderId ? {senderId: params.senderId} : {}),
        ...(params.receiverId ? {receiverId: params.receiverId} : {}),
        ...(params.startDate || params.finishDate ? {createdAt: dateFilter} : {})
      }
    })
  }

  async createEvent(senderId: string, params: CreateEventInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: senderId
      }
    })

    return this.prismaService.event.create({
      data: {
        type: params.type,
        senderId: senderId,
        senderName: user!.name,
        receiverId: params.receiverId,
        message: params.message
      }
    })
  }
}
