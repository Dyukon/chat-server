import { Test, TestingModule } from '@nestjs/testing'
import { UserResolver } from './user.resolver'
import { INestApplication, Logger } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app/app.module'
import { PrismaService } from '../lib/services/prisma.service'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'

describe('UserResolver', () => {
  const gql = '/graphql'

  const logger = new Logger('UserResolverTest')

  let app: INestApplication
  let prisma: DeepMockProxy<PrismaClient>

  const TEST_USER = {
    id: 'test_id',
    name: 'Test User',
    email: 'test_user@test.test',
    password: 'testuser'
  }

  const TEST_DB_USER = {
    id: 'test_id',
    name: 'Test User',
    email: 'test_user@test.test',
    hashedPassword: '$2a$10$4Ni6iQUgZv.38eRrRXjwsezEHXDxY9iDD/NEpGcGFvs1jkrxhQosK'
  }

  const mockPrisma = {
    user: {
      create: () => Promise.resolve(TEST_USER)
    }
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService]
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    prisma = moduleFixture.get(PrismaService)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {

  })

  it('createUser should create a new user', async () => {
    prisma.user.findFirst.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue(TEST_DB_USER)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            createUser(params: {
              name: "${TEST_USER.name}"
              email: "${TEST_USER.email}"
              password: "${TEST_USER.password}"
            }) {
              accessToken
              user { id name email hashedPassword }
            }  
          }    
        `
      })
      .expect(({ body }) => {
        const createUser = body?.data?.createUser
        expect(createUser).toBeDefined()

        const accessToken = createUser.accessToken
        expect(accessToken).toBeDefined()
        expect(accessToken.split('.').length).toBe(3)

        const user = createUser.user
        expect(user).toBeDefined()
        expect(user.id).toBeDefined()
        expect(user.name).toBe(TEST_USER.name)
        expect(user.email).toBe(TEST_USER.email)
        expect(user.hashedPassword).toBeDefined()
      })
  })

  it('createUser should not re-create an existing user', async () => {
    prisma.user.findFirst.mockResolvedValue(TEST_DB_USER)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            createUser(params: {
              name: "${TEST_USER.name}"
              email: "${TEST_USER.email}"
              password: "${TEST_USER.password}"
            }) {
              accessToken
              user { id }
            }
          }    
        `
      })
      .expect(({ body }) => {
        const errors = body?.errors
        expect(errors.length).toBe(1)
        const message = errors[0]?.message
        expect(message).toBeDefined()
        expect(message).toMatch(/already exists/i)
      })
  })

  it('loginUser should login an existing user', async () => {
    prisma.user.findFirst.mockResolvedValue(TEST_DB_USER)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            loginUser(params: {
              email: "${TEST_USER.email}"
              password: "${TEST_USER.password}"
            }) {
              accessToken
              user { id name email hashedPassword }
            }  
          }    
        `
      })
      .expect(({ body }) => {
        const loginUser = body?.data?.loginUser
        expect(loginUser).toBeDefined()

        const accessToken = loginUser.accessToken
        expect(accessToken).toBeDefined()
        expect(accessToken.split('.').length).toBe(3)

        const user = loginUser.user
        expect(user).toBeDefined()
        expect(user.id).toBeDefined()
        expect(user.name).toBe(TEST_USER.name)
        expect(user.email).toBe(TEST_USER.email)
        expect(user.hashedPassword).toBeDefined()
      })
  })

  it('loginUser should not login a non-existing user', async () => {
    prisma.user.findFirst.mockResolvedValue(null)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            loginUser(params: {
              email: "${TEST_USER.email}"
              password: "${TEST_USER.password}"
            }) {
              accessToken
              user { id name email hashedPassword }
            }  
          }    
        `
      })
      .expect(({ body }) => {
        const errors = body?.errors
        expect(errors.length).toBe(1)
        const message = errors[0]?.message
        expect(message).toBeDefined()
        expect(message).toMatch(/not found/i)
      })
  })

  it('loginUser should not login a user with wrong password', async () => {
    prisma.user.findFirst.mockResolvedValue(TEST_DB_USER)

    await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
          mutation {
            loginUser(params: {
              email: "${TEST_USER.email}"
              password: "wrong_password"
            }) {
              accessToken
              user { id name email hashedPassword }
            }  
          }    
        `
      })
      .expect(({ body }) => {
        const errors = body?.errors
        expect(errors.length).toBe(1)
        const message = errors[0]?.message
        expect(message).toBeDefined()
        expect(message).toMatch(/invalid password/i)
      })
  })
})
