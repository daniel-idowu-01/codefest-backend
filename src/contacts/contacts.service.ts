import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmergencyContact,
  EmergencyContactDocument,
} from './schema/contact.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(EmergencyContact.name)
    private contactsModel: Model<EmergencyContactDocument>,
  ) {
    this.seedEmergencyContacts();
  }

  async findAll(): Promise<EmergencyContact[]> {
    return this.contactsModel.find().sort({ state: 1, name: 1 }).exec();
  }

  async findByState(state: string): Promise<EmergencyContact[]> {
    return this.contactsModel.find({ state }).sort({ name: 1 }).exec();
  }

  async findByType(type: string): Promise<EmergencyContact[]> {
    return this.contactsModel.find({ type }).sort({ state: 1, name: 1 }).exec();
  }

  async find24HourContacts(): Promise<EmergencyContact[]> {
    return this.contactsModel
      .find({ is24Hours: true })
      .sort({ state: 1, name: 1 })
      .exec();
  }

  private async seedEmergencyContacts() {
    const count = await this.contactsModel.countDocuments();
    if (count > 0) return;

    const seedData = [
      {
        name: 'National Emergency Medical Service',
        type: 'Emergency Hotline',
        phoneNumber: '199',
        state: 'National',
        is24Hours: true,
        specialization: 'Emergency medical response and ambulance services',
      },
      {
        name: 'Nigeria Centre for Disease Control (NCDC)',
        type: 'Health Hotline',
        phoneNumber: '0800-9700-0010',
        alternativePhone: '07032864444',
        state: 'National',
        is24Hours: true,
        specialization: 'Disease outbreak reporting and health emergencies',
      },

      // Lagos State
      {
        name: 'Lagos State University Teaching Hospital (LASUTH)',
        type: 'Teaching Hospital',
        phoneNumber: '01-7743649',
        alternativePhone: '08033000333',
        address: '1-5 Oba Akinjobi Street, Ikeja, Lagos',
        state: 'Lagos',
        lga: 'Ikeja',
        is24Hours: true,
        specialization: 'Obstetrics, Gynecology, Emergency care',
      },
      {
        name: 'Lagos Emergency Medical Services (LASAMBUS)',
        type: 'Emergency Service',
        phoneNumber: '199',
        alternativePhone: '0800LASAMBUS',
        state: 'Lagos',
        is24Hours: true,
        specialization: 'Emergency response and ambulance services',
      },
      {
        name: 'Maternal and Child Health Centre, Isolo',
        type: 'Health Center',
        phoneNumber: '08033445566',
        address: 'Mushin Road, Isolo, Lagos',
        state: 'Lagos',
        lga: 'Isolo',
        is24Hours: false,
        specialization: 'Antenatal care, delivery, postnatal care',
      },

      // Kano State
      {
        name: 'Aminu Kano Teaching Hospital',
        type: 'Teaching Hospital',
        phoneNumber: '064-634237',
        alternativePhone: '08065432100',
        address: 'Zaria Road, Kano',
        state: 'Kano',
        lga: 'Kano Municipal',
        is24Hours: true,
        specialization: 'Obstetrics, Pediatrics, Emergency medicine',
      },
      {
        name: 'Kano State Emergency Management Agency',
        type: 'Emergency Service',
        phoneNumber: '08033556677',
        state: 'Kano',
        is24Hours: true,
        specialization: 'Emergency response and coordination',
      },

      // Kaduna State
      {
        name: 'Barau Dikko Teaching Hospital',
        type: 'Teaching Hospital',
        phoneNumber: '062-290290',
        alternativePhone: '08077889900',
        address: 'Zaria-Kaduna Road, Kaduna',
        state: 'Kaduna',
        lga: 'Kaduna North',
        is24Hours: true,
        specialization: 'Maternal health, Neonatal care, Surgery',
      },

      // Rivers State
      {
        name: 'University of Port Harcourt Teaching Hospital',
        type: 'Teaching Hospital',
        phoneNumber: '084-300700',
        alternativePhone: '08088776655',
        address: 'East-West Road, Port Harcourt',
        state: 'Rivers',
        lga: 'Port Harcourt',
        is24Hours: true,
        specialization: 'High-risk pregnancies, Neonatal intensive care',
      },

      // Anambra State
      {
        name: 'Nnamdi Azikiwe University Teaching Hospital',
        type: 'Teaching Hospital',
        phoneNumber: '046-460690',
        alternativePhone: '08099112233',
        address: 'Nnewi, Anambra State',
        state: 'Anambra',
        lga: 'Nnewi North',
        is24Hours: true,
        specialization: 'Obstetrics and Gynecology, Emergency care',
      },

      // General Health Centers
      {
        name: 'Primary Health Care Centre Network',
        type: 'Health Center',
        phoneNumber: '08011223344',
        state: 'Multi-State',
        is24Hours: false,
        specialization: 'Basic antenatal care, immunization, health education',
      },
    ];

    await this.contactsModel.insertMany(seedData);

    console.log('Emergency contacts seeded successfully');
  }
}
