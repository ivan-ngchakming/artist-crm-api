import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  preferredName: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  email: string;

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn()
  correspondenceAddress: Address;
}
