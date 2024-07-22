import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { ToDoDto } from './todo.dto';

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService) { }

    TASKS = [];

    async getById(id: string) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: +id
            }
        });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    getAll() {
        return this.prisma.task.findMany();
    }

    create(dto: ToDoDto) {
        return this.prisma.task.create({
            data: dto
        });
    }

    async toggleDone(id: string) {
        const task = await this.getById(id);
        return this.prisma.task.update({
            where: {
                id: task.id
            },
            data: {
                isDone: !task.isDone
            }
        });
    }

    async toggleDelete(id: string) {
        const task = await this.getById(id);
        return this.prisma.task.update({
            where: {
                id: task.id
            },
            data: {
                isDelete: !task.isDelete
            }
        });
    }

    async deleteToDo(id: string) {
        const task = await this.getById(id);
        if (!task) throw new NotFoundException('Task not found');

        return this.prisma.task.delete({
            where: {
                id: task.id
            }
        });
    }
}
