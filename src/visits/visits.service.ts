import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    const visit = this.visitsRepository.create({
      ...createVisitDto,
      visitDate: new Date(createVisitDto.visitDate),
      nextVisitReminder: createVisitDto.nextVisitReminder 
        ? new Date(createVisitDto.nextVisitReminder) 
        : null,
    });
    
    return this.visitsRepository.save(visit);
  }

  async findAll(): Promise<Visit[]> {
    return this.visitsRepository.find({
      order: { visitDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitsRepository.findOne({ where: { id } });
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Visit[]> {
    return this.visitsRepository.find({
      where: {
        visitDate: Between(new Date(startDate), new Date(endDate)),
      },
      order: { visitDate: 'ASC' },
    });
  }

  async getUpcomingReminders(): Promise<Visit[]> {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    return this.visitsRepository.find({
      where: {
        nextVisitReminder: Between(now, nextWeek),
      },
      order: { nextVisitReminder: 'ASC' },
    });
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const visit = await this.findOne(id);
    
    const updateData: any = { ...updateVisitDto };
    if (updateVisitDto.visitDate) {
      updateData.visitDate = new Date(updateVisitDto.visitDate);
    }
    if (updateVisitDto.nextVisitReminder) {
      updateData.nextVisitReminder = new Date(updateVisitDto.nextVisitReminder);
    }

    await this.visitsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const visit = await this.findOne(id);
    await this.visitsRepository.remove(visit);
  }

  async getVisitStats() {
    const totalVisits = await this.visitsRepository.count();
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    
    const thisMonthVisits = await this.visitsRepository.count({
      where: {
        visitDate: Between(thisMonthStart, new Date()),
      },
    });

    const upcomingReminders = await this.getUpcomingReminders();

    return {
      totalVisits,
      thisMonthVisits,
      upcomingReminders: upcomingReminders.length,
    };
  }
}
