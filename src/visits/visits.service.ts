import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schema/visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    const visit = new this.visitModel({
      ...createVisitDto,
      visitDate: new Date(createVisitDto.visitDate),
      nextVisitReminder: createVisitDto.nextVisitReminder
        ? new Date(createVisitDto.nextVisitReminder)
        : null,
    });
    return visit.save();
  }

  async findAll(): Promise<Visit[]> {
    return this.visitModel.find().sort({ visitDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitModel.findById(id).exec();
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Visit[]> {
    return this.visitModel
      .find({
        visitDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({ visitDate: 1 })
      .exec();
  }

  async getUpcomingReminders(): Promise<Visit[]> {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    return this.visitModel
      .find({
        nextVisitReminder: { $gte: now, $lte: nextWeek },
      })
      .sort({ nextVisitReminder: 1 })
      .exec();
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const updateData: any = { ...updateVisitDto };
    if (updateVisitDto.visitDate) {
      updateData.visitDate = new Date(updateVisitDto.visitDate);
    }
    if (updateVisitDto.nextVisitReminder) {
      updateData.nextVisitReminder = new Date(updateVisitDto.nextVisitReminder);
    }

    const visit = await this.visitModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async remove(id: string): Promise<void> {
    const visit = await this.visitModel.findByIdAndDelete(id).exec();
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
  }

  async getVisitStats() {
    const totalVisits = await this.visitModel.countDocuments().exec();

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);

    const thisMonthVisits = await this.visitModel
      .countDocuments({
        visitDate: { $gte: thisMonthStart, $lte: new Date() },
      })
      .exec();

    const upcomingReminders = await this.getUpcomingReminders();

    return {
      totalVisits,
      thisMonthVisits,
      upcomingReminders: upcomingReminders.length,
    };
  }
}
