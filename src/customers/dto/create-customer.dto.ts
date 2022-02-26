import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

export class CreateCustomerDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly preferredName: string;
  readonly address: CreateAddressDto;
  readonly correspondenceAddress: CreateAddressDto;
}
