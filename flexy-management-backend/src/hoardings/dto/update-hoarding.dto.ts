import { PartialType } from '@nestjs/mapped-types';
import { CreateHoardingDto } from './create-hoarding.dto';

export class UpdateHoardingDto extends PartialType(CreateHoardingDto) {}
