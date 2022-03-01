import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Address } from '../../addresses/entities/address.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column({ nullable: true })
  preferredName: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  email: string;

  @OneToOne(() => Address, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Address, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  correspondenceAddress: Address;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({
    generatedType: 'STORED',
    asExpression: `"firstName" || ' ' || "lastName" || ' ' || "preferredName"`,
  })
  fullName: string;
}
