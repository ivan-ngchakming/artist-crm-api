import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { Address } from 'src/addresses/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Address])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {}
