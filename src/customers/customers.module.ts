import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Address]), AddressesModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
