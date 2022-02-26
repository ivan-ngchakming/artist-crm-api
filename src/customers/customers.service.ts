import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { AddressesService } from '../addresses/addresses.service';
import { CreateAddressDto } from '../addresses/dto/create-address.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private addressesService: AddressesService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customerEntity = Customer.create(createCustomerDto);
    await Customer.save(customerEntity);
    return customerEntity;
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(id: number) {
    return this.customerRepository.findOne(id);
  }

  async createOrUpdateAddress(
    customerEntity: Customer,
    updateAddressDto: CreateAddressDto,
  ) {
    if (customerEntity.address) {
      return await this.addressesService.update(
        customerEntity.address.id,
        updateAddressDto,
      );
    }
    return await this.addressesService.create(updateAddressDto);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const { address, correspondenceAddress, ...restDto } = updateCustomerDto;

    const prevCustomerEntity = await this.findOne(id);

    if (!prevCustomerEntity)
      throw new HttpException(
        `Customer with id:${id} not found.`,
        HttpStatus.NOT_FOUND,
      );

    const addressEntity =
      !!address &&
      (await this.createOrUpdateAddress(prevCustomerEntity, address));
    const correspondenceAddressEntity =
      !!correspondenceAddress &&
      (await this.createOrUpdateAddress(
        prevCustomerEntity,
        correspondenceAddress,
      ));

    const customerEntity = Customer.create({
      id: id,
      ...restDto,
    });

    if (addressEntity) customerEntity.address = addressEntity;
    if (correspondenceAddressEntity)
      customerEntity.correspondenceAddress = correspondenceAddressEntity;

    await this.customerRepository.save(customerEntity);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.customerRepository.delete(id);
  }
}
