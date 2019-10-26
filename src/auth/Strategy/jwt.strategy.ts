import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { configService } from '../../shared/Config/config.service';
import { UsersService } from '../../users/Service/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate({ iat, exp, _id }): Promise<any> {
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.get(_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const data = {
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };

    return data;
  }
}
