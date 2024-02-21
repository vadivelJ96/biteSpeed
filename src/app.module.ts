import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './database/entities/contacts.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),ContactsModule, DatabaseModule,TypeOrmModule.forRoot({
    type: 'postgres',
    host:process.env.host,
    port:+process.env.port, 
    username:process.env.username,
    password: process.env.password,
    database: process.env.database, 
    entities: [__dirname + '/**/*.entity{.ts,.js}'], 
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
