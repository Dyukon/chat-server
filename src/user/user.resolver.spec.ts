import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app/app.module'
import { PrismaService } from '../lib/services/prisma.service'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'

describe('UserResolver', () => {
  const gql = '/graphql'

  let app: INestApplication;
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
    hashedPassword: 'hashedPassword'
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
  });

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {

  })

  it('createUser should create a new user', async () => {
    prisma.user.findFirst.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue(TEST_DB_USER)

    const result = await request(app.getHttpServer())
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
              user {
                id
                name
                email
              }
            }
          }    
        `
      })
    console.log(`result: ${result}`)
  });
});
