import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common'
import { CrerateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CrerateUserDto) {
    this.userService.create(body.email, body.password)
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id))

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email)
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    this.userService.update(parseInt(id), body)
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id))
  }
}
