import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';

declare module 'express-session' {
  interface Session {
    refDoc: string;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/google')
  async loginWithGoogle(
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: Request,
  ) {
    if (!loginAuthDto.id_token)
      throw new BadRequestException('Id token not provided');

    const user = await this.authService
      .loginWithGoogle(loginAuthDto)
      .catch(() => {
        throw new BadRequestException(
          'Firebase ID token has invalid signature',
        );
      });
    req.session.refDoc = user.refDoc;
    return user;
  }

  @Get('/verify')
  async validateById(@Req() req: Request) {
    const refDoc = req.session.refDoc;

    if (!refDoc) throw new UnauthorizedException('Invalid user');

    return await this.authService.validateById(refDoc).catch(() => {
      throw new UnauthorizedException('Invalid user');
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request) {
    req.session.destroy(() => {
      // nothing to do
    });
    return 'logout successful';
  }
}
