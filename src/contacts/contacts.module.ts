import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../database/entities/contacts.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Contact]),DatabaseModule],
  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}
