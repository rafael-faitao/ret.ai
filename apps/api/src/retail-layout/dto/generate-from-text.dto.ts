import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateFromTextDto {
  @IsString()
  @IsNotEmpty()
  description!: string;
}
