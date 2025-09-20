import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { EmergencyContact } from './entities/contact.entity';
@Module({
  imports: [TypeOrmModule.forFeature([EmergencyContact])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}