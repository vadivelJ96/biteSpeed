import { Body, Controller, Get, Post,Delete } from '@nestjs/common';
import { Contact } from 'src/database/entities/contacts.entity';
import { ContactsService } from './contacts.service';
import { ContactDto } from './DTO/contacts.dto';

@Controller()
export class ContactsController {
    constructor(private contactsService:ContactsService){}

    @Get('/identify')
    getContacts(){
          return this.contactsService.getContacts();
    } 

    @Post('/identify')
    postContact(@Body() body:ContactDto){
       return this.contactsService.postContact(body);
    }

    
    @Delete('/identify')
    deleteContact(@Body() body:ContactDto){
       return this.contactsService.clearAllContacts();
    }
}
