import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  //let jwtService: JwtService;
  const userEntityMock = {
    id: 2,
    email: 'mutoe@foxmail.com',
    name: 'mutoe',
    passwordHash:
      '$argon2i$v=19$m=4096,t=3,p=1$g7im6iPtd5ElrS43uzTUHw$y08yzQmb76KiB9AxKExQBEN3k4ytzX4+qSE9WEMeIDQ',
    isActive: true,
  };
  beforeAll(async () => {
    const userServiceMock = {
      create: jest.fn(),
      findOneNameOrEmail: jest.fn((u) => {
        if (u === userEntityMock.email || u === userEntityMock.name) {
          return userEntityMock;
        } else {
          return null;
        }
      }),
      createSocial: jest.fn(() => userEntityMock),
      findSocial: jest.fn(),
    };
    const jwtServiceMock = {
      sign: jest.fn(() => 'imAnAccessToken'),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UserModule,
        AuthModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
            },
          }),
        }),
      ],
      providers: [AuthService, JwtService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();
    //Clean Up actual Database Connection
    const repository = module.get(getRepositoryToken(User));
    await (await repository.manager.connection).close();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    //jwtService = module.get<JwtService>(JwtService);
  });
  const signupUserMock: SignupDto = {
    email: 'mutoe@foxmail.com',
    name: 'mutoe',
    password: 'TU246zert*',
  };
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  describe('signup', () => {
    it('should call UserService create', async () => {
      await service.signup(signupUserMock);

      expect(userService.create).toBeCalledWith(signupUserMock);
    });
  });
  const loginUserMock: LoginDto = {
    nameOrEmail: 'mutoe@foxmail.com',
    password: 'TU246zert*',
  };
  describe('validateUser', () => {
    it('should get the user given a LoginDto, verify the password and return a stripped version of the user', async () => {
      const strippedUser = await service.validateUser(
        loginUserMock.nameOrEmail,
        loginUserMock.password
      );

      expect(strippedUser).toStrictEqual({
        name: userEntityMock.name,
        email: userEntityMock.email,
      });
    });
  });
  describe('socialLoginOrSignup', () => {
    const googleDataMock = {
      firstName: 'hans',
      email: 'hans@hansi.de',
      socialId: 'socialid',
    };
    it('should call findOneNameOrEmail', async () => {
      await service.socialLoginOrSignup('google', googleDataMock);
      expect(userService.findSocial).toHaveBeenCalledWith(
        'google',
        googleDataMock.socialId
      );
    });
    it('should call createSocial if findOneNameOrEmail does not find the user', async () => {
      jest.spyOn(userService, 'findSocial').mockResolvedValue(null);
      await service.socialLoginOrSignup('google', googleDataMock);
      expect(userService.createSocial).toHaveBeenCalledTimes(2);
    });
    it('should not call createSocial if findOneNameOrEmail does find the user', async () => {
      jest
        .spyOn(userService, 'findSocial')
        .mockResolvedValue({ name: 'hans', email: 'hans@hansi.de' } as User);
      await service.socialLoginOrSignup('google', userEntityMock);
      expect(userService.createSocial).toHaveBeenCalledTimes(2);
    });
    it('should throw if the authguard does not provide a user', async () => {
      expect(
        async () => await service.socialLoginOrSignup('google', null)
      ).rejects.toThrow(
        new HttpException(
          'Authentication was refused by provider',
          HttpStatus.UNAUTHORIZED
        )
      );
    });
  });
});
