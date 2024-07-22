import { IsString } from 'class-validator';

export class ToDoDto {
  @IsString()
  title: string;
}
