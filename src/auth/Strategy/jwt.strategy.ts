import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { configService } from '../../shared/Config/config.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/Entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

    const user = await this.userRepository.findOne(_id);

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
