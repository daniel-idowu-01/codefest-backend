import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
// import { EmergencyContact } from './entities/contact.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmergencyContact,
  EmergencyContactSchema,
} from './schema/contact.schema';
@Module({
  // imports: [TypeOrmModule.forFeature([EmergencyContact])],
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
