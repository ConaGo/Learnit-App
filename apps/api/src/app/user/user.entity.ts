import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../auth/dto/user.social.data';
import { classToPlain, Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @ApiProperty({ example: 1, description: 'Unique Identifier' })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'name@provider.com',
    description: 'Unique user-email',
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Length(3, 15)
  @Column()
  name: string;

  @Exclude()
  @Column({ default: '' })
  passwordHash: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
    array: true,
    default: [],
  })
  refreshTokenHashes?: string[];

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'varchar', default: 'local' })
  authType: AuthType;

  @Exclude()
  @Column({ default: '' })
  socialId: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return classToPlain(this);
  }
}
