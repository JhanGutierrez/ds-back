import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Query() query: FindUserDto) {
    return this.usersService.findOne(query);
  }
}
