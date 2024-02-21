import { Optional } from '@nestjs/common';
import { IsEmail } from 'class-validator';


export class ContactDto {
  id: number;

  @IsEmail()
  @Optional()
  email: string;
  
  @Optional()
  phoneNumber:string;
}
