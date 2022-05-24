import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from './user.entity'
import { UsersService } from './users.service'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('Create new user with salted and hashed password', async () => {
    const user = await service.signup('greg@gmail.com', 'qwerty')
    expect(user.password).not.toEqual('qwerty')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup('greg@gmail.com', 'qwerty')

    await expect(service.signup('greg@gmail.com', 'qwerty')).rejects.toThrow(
      BadRequestException,
    )
  })

  it('Throws if signin is called with an unused email', async () => {
    await expect(service.signin('greg@gmail.com', 'qwerty')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('Throws if invalid password is provided', async () => {
    await service.signup('greg@gmail.com', 'qwerty')

    await expect(service.signin('greg@gmail.com', 'password')).rejects.toThrow(
      BadRequestException,
    )
  })

  it('It return user if correct password provided', async () => {
    await service.signup('greg@gmail.com', 'qwerty')

    const userToTest = await service.signin('greg@gmail.com', 'qwerty')
    expect(userToTest).toBeDefined()
  })
})
