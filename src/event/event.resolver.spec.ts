import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app/app.module'
import { PrismaService } from '../lib/services/prisma.service'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'
import { GqlExecutionContext } from '@nestjs/graphql'

describe('EventResolver', () => {
  const gql = '/graphql'

  let app: INestApplication
  let prisma: DeepMockProxy<PrismaClient>

  const TEST_USER_ID = 'test_id'
  const TEST_USER_NAME = 'Test User'
  const TEST_USER_EMAIL = 'test_user@test.test'
  const TEST_USER_PASSWORD = 'testuser'
  const TEST_USER_HASHED_PASSWORD = '$2a$10$4Ni6iQUgZv.38eRrRXjwsezEHXDxY9iDD/NEpGcGFvs1jkrxhQosK'

  const TEST_DB_USER = {
    id: TEST_USER_ID,
    name: TEST_USER_NAME,
    email: TEST_USER_EMAIL,
    hashedPassword: TEST_USER_HASHED_PASSWORD
  }

  const TEST_EVENT_ID = 'test_event_id'

  const TEST_DB_EVENT = {
    id: TEST_EVENT_ID,
    senderId: TEST_USER_ID,
    createdAt: new Date()
  }

  const TEST_MESSAGE = 'Test message'
  const TEST_DB_MESSAGE_EVENT = {
    ...TEST_DB_EVENT,
    type: 'message',
    message: TEST_MESSAGE,
    senderName: TEST_USER_NAME,
    receiverId: null
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const ctx = GqlExecutionContext.create(context)
          ctx.getContext().req.user = TEST_DB_USER
          return true
        }
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    prisma = moduleFixture.get(PrismaService)
  })

  afterAll(async () => {
    await app.close()
  })

  it('createEvent should create a new message event', async () => {
    prisma.user.findUnique.mockResolvedValue(TEST_DB_USER)
    prisma.event.create.mockResolvedValue(TEST_DB_MESSAGE_EVENT)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            createEvent(params: {
              type: MESSAGE,
              message: "${TEST_MESSAGE}"
            }) { id type senderId message }
          }    
        `
      })
      .expect(({ body }) => {
        const event = body?.data?.createEvent
        expect(event).toBeDefined()
        expect(event.id).toBe(TEST_EVENT_ID)
        expect(event.type).toBe('MESSAGE')
        expect(event.senderId).toBe(TEST_USER_ID)
        expect(event.message).toBe(TEST_MESSAGE)
      })
  })
})
