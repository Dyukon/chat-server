import { Injectable } from '@nestjs/common'
import { CreateEventInput } from './models/create-event.input'
import { EventsInput } from './models/events.input'
import { PrismaService } from '../lib/services/prisma.service'
import { EventType } from './models/event-type.model'
import { ApolloError } from 'apollo-server-express'

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

    console.log(`params.type: ${params.type}`)
    if (params.type === EventType.JOIN || params.type === EventType.LEAVE) {
      // avoid presence event duplication
      const lastPresenceEvents = await this.prismaService.event.findMany({
        where: {
          senderId: senderId,
          type: {
            in: [EventType.JOIN, EventType.LEAVE]
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      })
      console.log(`lastPresenceEvents: ${JSON.stringify(lastPresenceEvents)}`)
      if (lastPresenceEvents.length>0 && lastPresenceEvents[0].type === params.type) {
        throw new ApolloError('Duplicate presence event!')
      }
    }

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
