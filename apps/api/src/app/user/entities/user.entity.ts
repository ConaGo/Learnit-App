import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  EntityColumnNotFound,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../../auth/dto/user.social.data';
import { classToPlain, Exclude } from 'class-transformer';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserToQuestionStats } from '../../question/entities/userToQuestionStats.entity';
import { BaseEntity } from '../../typeorm/base.entity';
import { RefreshTokenHash } from './refreshTokenHash.entity';

export type Role = 'user' | 'creator' | 'moderator' | 'admin';

@Entity('user')
@ObjectType({ description: 'User Object' })
export class User extends BaseEntity {
  @ApiProperty({
    example: 'name@provider.com',
    description: 'Unique user-email',
  })
  @IsEmail()
  @Field({ description: 'Unique e-mail | example: nest@js.com' })
  @Column({ unique: true })
  email: string;

  @Length(3, 15)
  @Field()
  @Column()
  name: string;

  @Exclude()
  @Column({ default: '' })
  passwordHash: string;

  @Exclude()
  @OneToMany(
    () => RefreshTokenHash,
    (refreshTokenHash) => refreshTokenHash.user,
    { cascade: true }
  )
  refreshTokenHashes!: RefreshTokenHash[];

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'varchar', default: 'local' })
  authType: AuthType;

  @Exclude()
  @Column({ default: '' })
  socialId: string;

  @Column({ default: 'user' })
  role: Role;

  @OneToMany(
    () => UserToQuestionStats,
    (userToQuestionStats) => userToQuestionStats.user,
    { cascade: true, onDelete: 'CASCADE' }
  )
  public userToQuestionStats!: UserToQuestionStats;

  constructor(partial: Partial<User>) {
    super({});
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
