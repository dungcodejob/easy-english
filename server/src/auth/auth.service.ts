import { AccountService, UserService } from '@app/account';
import { SLUG_REGEX } from '@app/constants';
import { Role } from '@app/entities';
import { TenantService } from '@app/tenant';
import { formatName, generatePointSlug, generateSlug } from '@app/utils';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { isEmail } from 'class-validator';
import { LoginDto, RegisterDto } from './dto';
import { TokenTypeEnum } from './enums/token-type.enum';
import { IAuthResult } from './interfaces';
import { BacklistService, BcryptService, JwtTokenService } from './services';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly bcryptService: BcryptService,
    private readonly backlistService: BacklistService,
    private readonly em: EntityManager,
  ) {}

  async login(dto: LoginDto, domain?: string): Promise<IAuthResult> {
    const { emailOrUsername, password } = dto;

    const account = await this.getAccountByEmailOrUsername(emailOrUsername);

    if (!account) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatchPassword = await compare(password, account.passwordHash);

    if (!isMatchPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.jwtTokenService.generateAccessToken(account);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(account);

    return {
      accessToken,
      refreshToken,
      user: account.user,
    };
  }

  async register(dto: RegisterDto, domain?: string) {
    const { email, password, name } = dto;
    const isEmailExists = await this.checkEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const formattedName = formatName(name);
    const passwordHash = await this.bcryptService.hash(password);
    const username = await this.generateUsername(formattedName);

    const user = this.userService.create({
      name,
      role: Role.USER,
    });

    const account = this.accountService.create({
      email,
      passwordHash,
      username,
      user,
    });

    const tenant = this.tenantService.create({
      name: formattedName,
      slug: generateSlug(formattedName),
      owner: account,
    });

    await this.em.flush();
  }

  async refreshToken(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { id, version, tokenId } = await this.jwtTokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    const isBlacklisted = await this.backlistService.checkIfTokenIsBlacklisted(
      id,
      tokenId,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    const account = await this.accountService.findOneByCredentials(id, version);

    const accessToken = await this.jwtTokenService.generateAccessToken(
      account,
      domain,
      tokenId,
    );

    const newRefreshToken = await this.jwtTokenService.generateRefreshToken(
      account,
      domain,
      tokenId,
    );

    return { user: account.user, accessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken: string) {
    const { id, tokenId, exp } = await this.jwtTokenService.verifyToken(
      accessToken,
      TokenTypeEnum.REFRESH,
    );

    await this.backlistService.addTokenBlacklist(id, tokenId, exp);
  }

  private async getAccountByEmailOrUsername(emailOrUsername: string) {
    if (emailOrUsername.includes('@')) {
      if (!isEmail(emailOrUsername)) {
        throw new BadRequestException('Invalid email');
      }
      console.log('emailOrUsername', emailOrUsername);
      return this.accountService.findOneByEmail(emailOrUsername);
    }

    if (
      emailOrUsername.length < 3 ||
      emailOrUsername.length > 106 ||
      !SLUG_REGEX.test(emailOrUsername)
    ) {
      throw new BadRequestException('Invalid username');
    }

    return this.accountService.findOneByUsername(emailOrUsername);
  }

  private async checkEmailExists(email: string) {
    const count = await this.accountService.count({
      email,
    });

    return count > 0;
  }

  private async generateUsername(name: string): Promise<string> {
    const pointSlug = generatePointSlug(name);
    const count = await this.accountService.count({
      username: {
        $like: `${pointSlug}%`,
      },
    });

    if (count > 0) {
      return `${pointSlug}${count}`;
    }

    return pointSlug;
  }
}
