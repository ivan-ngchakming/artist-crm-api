import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customerEntity = await this.customerRepository.create();
    return this.customerRepository.save({
      ...customerEntity,
      ...createCustomerDto,
    });
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(id: number) {
    return this.customerRepository.findOne(id);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customerEntity =
      (await this.findOne(id)) || (await this.customerRepository.create());

    return this.customerRepository.save(
      _.merge(customerEntity, updateCustomerDto),
    );
  }

  async remove(id: number) {
    await this.customerRepository.delete(id);
  }
}
