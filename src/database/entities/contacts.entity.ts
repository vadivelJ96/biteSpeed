import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) 
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({nullable:true})
  linkedId:string;

  @Column({ nullable: true })
  linkPrecedence: string;

  @Column({ nullable: true })
  createdAt: string;

  @Column({ nullable: true })
  updatedAt: string;

  @Column({nullable:true})
  deletedAt:string;
 
}

