import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'greg@gmail.com',
          password: 'qwerty',
        } as User)
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'qwerty',
          } as User,
        ])
      },
      // remove: () => {},
      // update: () => {},
    }
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
      // signup: () => {},
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAllUsers returns a lit of users with the given email', async () => {
    const users = await controller.findAllUsers('greg@gmail.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('greg@gmail.com')
  })

  it('findUser returns single user with the given id', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
    expect(user.id).toEqual(1)
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => {
      return Promise.resolve(null)
    }

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 }
    const request = { email: 'greg@gmail.com', password: 'qwerty' }

    const user = await controller.signin(request, session)

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
})
