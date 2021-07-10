import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'nameOrEmail' });
  }

  async validate(nameOrEmail: string, password: string): Promise<any> {
    console.log(nameOrEmail);
    const user = await this.authService.validateUser(nameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
