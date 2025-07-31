import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { User } from './entities/auth.entity';
import { RolesGuard } from './guards/roles.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '@/auth/dto/response/user.response.dto';
import { Auth, GetUser, Roles } from './decorators';
import { UserRole } from './enums/role.enum';
import { AuthResponseDto, CreateUserDto, LoginUserDto } from '@/auth/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User was created successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User was logged in successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'User authentication status checked successfully',
    type: AuthResponseDto,
  })
  @ApiBearerAuth()
  @Get('check-status')
  @UseGuards(AuthGuard())
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // Route private get user
  @ApiOperation({ summary: 'Get the user' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: UserResponseDto,
  })
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser() user: User) {
    return user;
  }

  // Route private with roles using the decorator
  @ApiOperation({ summary: 'Get the user with roles' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: UserResponseDto,
  })
  @ApiBearerAuth()
  @Get('private2')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(AuthGuard(), RolesGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return user;
  }

  // Route private with roles using the decorator composition
  @ApiOperation({ summary: 'Get the user with roles' })
  @ApiResponse({
    status: 200,
    description: 'User was fetched successfully',
    type: UserResponseDto,
  })
  @Get('private3')
  @Auth(UserRole.ADMIN, UserRole.SELLER)
  testingPrivateRoute3(@GetUser() user: User) {
    return user;
  }
}
