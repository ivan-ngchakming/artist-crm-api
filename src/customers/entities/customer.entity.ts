import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  preferred_name: string;

  @Column()
  instagram: string;

  @Column()
  email: string;

  @OneToOne(() => Address)
  address: Address;

  @OneToOne(() => Address)
  correspondenceAddress: Address;
}
