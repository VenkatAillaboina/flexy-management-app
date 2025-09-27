import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsNumber } from 'class-validator';

export class RouteHoardingsDto {
  @ApiProperty({
    type: [Number],
    example: [79.5941, 17.9689],
    description: 'Source coordinates as [longitude, latitude].',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  source: [number, number];

  @ApiProperty({
    type: [Number],
    example: [79.6, 17.97],
    description: 'Destination coordinates as [longitude, latitude].',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  destination: [number, number];
}