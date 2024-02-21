import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../database/entities/contacts.entity';
import { ContactDto } from './DTO/contacts.dto';

@Injectable()
export class ContactsService {
    constructor(@InjectRepository(Contact) private contactRepository: Repository<Contact>) {
    }

    async primaryIdCheck(body: { email?: string, phoneNumber?: string }) {
        const primaryIdCheck = await this.contactRepository.find({
            where: [
                { email: body.email },
                { phoneNumber: body.phoneNumber }
            ],
            order: { createdAt: 'ASC' }, 
            
        });

        return primaryIdCheck; 
    }

    async bothPrimaryCheckAndUpdate(body: { email?: string, phoneNumber?: string }) {
        const emailPrimaryCheck = await this.contactRepository.createQueryBuilder('contact')
             .where('contact.email = :email', { email: body.email })
            .andWhere('contact.linkedId IS NULL')
            .getMany();

            const phoneNumberPrimaryCheck =await this.contactRepository.createQueryBuilder('contact')
            .where('contact.phoneNumber = :phoneNumber', { phoneNumber:body.phoneNumber })
            .andWhere('contact.linkedId IS NULL')
            .getMany();

            console.log(emailPrimaryCheck);
            console.log(phoneNumberPrimaryCheck);

        if((emailPrimaryCheck.length>0) && (phoneNumberPrimaryCheck.length>0) 
        && (emailPrimaryCheck[0].id !== phoneNumberPrimaryCheck[0].id))
        {
                  
           if(parseInt(emailPrimaryCheck[0].createdAt) > parseInt(phoneNumberPrimaryCheck[0].createdAt)){
           emailPrimaryCheck[0].linkPrecedence='secondary';
           emailPrimaryCheck[0].linkedId=phoneNumberPrimaryCheck[0].id.toString();
            await this.contactRepository.save(emailPrimaryCheck[0])
            }else if(parseInt(emailPrimaryCheck[0].createdAt) == parseInt(phoneNumberPrimaryCheck[0].createdAt)){
                return false
            }
            else{
          phoneNumberPrimaryCheck[0].linkPrecedence='secondary';
          phoneNumberPrimaryCheck[0].linkedId=emailPrimaryCheck[0].id.toString()
          await this.contactRepository.save(phoneNumberPrimaryCheck[0])    
            }
     
        return {
            contact:{
                primaryContatctId:emailPrimaryCheck[0].linkPrecedence=='primary'?emailPrimaryCheck[0].id:phoneNumberPrimaryCheck[0].id,
                emails:[emailPrimaryCheck[0].email,phoneNumberPrimaryCheck[0].email], 
                phoneNumbers:[emailPrimaryCheck[0].phoneNumber,phoneNumberPrimaryCheck[0].phoneNumber],
                secondaryContactIds:[emailPrimaryCheck[0].linkPrecedence=='secondary'?emailPrimaryCheck[0].id:phoneNumberPrimaryCheck[0].id] 
            }
        }
           }
          
           return false
}

    async postContact(body:ContactDto) {
        let matchId=null;
        let matchPrecedence='primary'
        if(body.email==null &&  body.phoneNumber==null){return "email and phone number missing!!"}
        const primaryIdCheckResult=await this.primaryIdCheck({email:body.email,phoneNumber:body.phoneNumber})
        const bothPrimaryCheckAndUpdateResult= await this.bothPrimaryCheckAndUpdate({email:body.email,phoneNumber:body.phoneNumber})
         if(bothPrimaryCheckAndUpdateResult){
            return bothPrimaryCheckAndUpdateResult
        }
      
        if(primaryIdCheckResult.length>0){
             matchId=primaryIdCheckResult[0].id
             matchPrecedence='secondary'
        }
        	
        const newContact =this.contactRepository.create(
            {...body,
                linkedId:matchId,
                linkPrecedence:matchPrecedence,
                createdAt:Date.now().toString(),
                updatedAt:Date.now().toString()
        });
       
        let result=await this.contactRepository.save(newContact);

        let emailArray=[]
        let phoneNumberArray=[]
        let secondaryContactIddArray=[]
     
        for(let i=0;i<primaryIdCheckResult.length;i++){
            emailArray.push(primaryIdCheckResult[i].email);
            phoneNumberArray.push(primaryIdCheckResult[i].phoneNumber);
            secondaryContactIddArray.push(primaryIdCheckResult[i].id)
        }
        emailArray.push(result.email);
        phoneNumberArray.push(result.phoneNumber);
        emailArray=[...new Set( emailArray)]
        phoneNumberArray=[...new Set(phoneNumberArray)]
              
        return{
            contact:{
                primaryContatctId:matchId?matchId:result.id,
                emails:[matchPrecedence=='primary'?result.email:emailArray], 
                phoneNumbers:[matchPrecedence=='primary'?result.phoneNumber:phoneNumberArray],
                secondaryContactIds:[...secondaryContactIddArray] 
            }
        }
        
        
       
    }

    async getContacts() {
        const getContact=await this.contactRepository.findBy({deletedAt:null});
        return getContact;
    }


}
