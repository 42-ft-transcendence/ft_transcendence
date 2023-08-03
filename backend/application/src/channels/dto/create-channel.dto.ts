import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateChannelDto {
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(ChannelType)
  @IsNotEmpty()
  @ApiProperty({ enum: ChannelType, default: ChannelType.PUBLIC })
  type: ChannelType;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  ownerId: number;

  @Length(4, 20)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((c) => c.type === ChannelType.PROTECTED)
  @ApiProperty({ required: false, minLength: 4, maxLength: 20 })
  password?: string;
}
