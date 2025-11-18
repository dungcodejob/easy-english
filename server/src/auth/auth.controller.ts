import { COOKIE_NAMES } from '@app/constants';
import { Origin, Public } from '@app/decorators';
import { isNil } from '@app/utils';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { InjectJwtConfig, JwtConfig } from '@app/configs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAccessDto } from './interfaces';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly _cookiePath = '/api/auth';
  private readonly _isTesting: boolean;
  private readonly _refreshTime: number;

  constructor(
    @InjectJwtConfig()
    private readonly _jwtConfig: JwtConfig,
    private readonly _authService: AuthService,
  ) {
    this._refreshTime = _jwtConfig.refresh.time;
    this._isTesting = true;
  }

  @Public()
  @Post('login')
  async login(
    @Res() res: Response,
    @Origin() origin: string | undefined,
    @Body() loginDto: LoginDto,
  ) {
    const result = await this._authService.login(loginDto, origin);
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(result);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('body', registerDto);
    try {
      return this._authService.register(registerDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body() refreshAccessDto: RefreshAccessDto,
    @Origin() origin: string,
  ) {
    const token = this.getRefreshFromCookieOrBody(req, refreshAccessDto);
    const result = await this._authService.refreshToken(token, origin);
    this.saveRefreshCookie(res, result.refreshToken).status(200).json(result);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Body() refreshAccessDto: RefreshAccessDto,
  ) {
    const token = this.getRefreshFromCookieOrBody(req, refreshAccessDto);
    await this._authService.logout(token);

    this.clearCookies(res)
      .header('Content-Type', 'application/json')
      .status(HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  private saveRefreshCookie(res: Response, refreshToken: string): Response {
    return res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      secure: !this._isTesting,
      httpOnly: true,
      signed: true,
      path: this._cookiePath,
      expires: new Date(Date.now() + this._refreshTime * 1000),
    });
  }

  private clearCookies(res: Response): Response {
    return res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
      path: this._cookiePath,
    });
  }

  private getRefreshFromCookieOrBody(
    req: Request,
    body: RefreshAccessDto,
  ): string {
    const token: string | undefined =
      req.signedCookies[COOKIE_NAMES.REFRESH_TOKEN] ?? body.refreshToken;
    if (isNil(token)) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
