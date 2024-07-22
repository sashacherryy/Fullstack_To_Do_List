import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { ToDoDto } from './todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAll() {
    return this.todoService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: ToDoDto) {
    return this.todoService.create(dto);
  }

  @Patch('done/:id')
  async toggleDone(@Param('id') id: string) {
    return this.todoService.toggleDone(id);
  }

  @Patch('delete/:id')
  async toggleDelete(@Param('id') id: string) {
    return this.todoService.toggleDelete(id);
  }

  @Delete(':id')
  async deleteToDo(@Param('id') id: string) {
    return this.todoService.deleteToDo(id);
  }
}
