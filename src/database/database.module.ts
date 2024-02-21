import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  providers: [DatabaseService,Contact],
  exports:[Contact]
})
export class DatabaseModule {}
