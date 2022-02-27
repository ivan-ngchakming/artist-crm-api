import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';

describe('AddressesService', () => {
  let service: AddressesService;

  let mockAddresses = [
    { id: 1, lineOne: 'addr 1 line one', lineTwo: 'addr 1 line two' },
    { id: 2, lineOne: 'addr 2 line one', lineTwo: 'addr 2 line two' },
  ];

  const mockRepository = {
    find: () => mockAddresses,
    findOne: (id: number) => mockAddresses.find((address) => address.id === id),
    create: (obj) => obj,
    save: (obj) => [{ id: mockAddresses.length, ...obj }, ...mockAddresses],
    update: (id, obj) => {
      mockAddresses = {
        ...mockAddresses.find((address) => address.id === id),
        ...obj,
      };
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all addresses', () => {
    expect(service.findAll()).toBe(mockAddresses);
  });

  it('should get one address', () => {
    expect(service.findOne(1)).toBe(mockAddresses[0]);
  });

  it('should create address', () => {
    const addressToBeCreated = {
      lineOne: 'new addr line 1',
      lineTwo: 'new addr line 2',
    };
    service
      .create(addressToBeCreated)
      .then((data) => {
        expect(data).toContain(expect.objectContaining(addressToBeCreated));
      })
      .catch((error) => console.error(error));
  });

  it('should update address', () => {
    service
      .update(2, { lineOne: 'new addr line 1' })
      .then((data) => {
        expect(data).toContain(
          expect.objectContaining({ id: 2, lineOne: 'updated address line 1' }),
        );
      })
      .catch((error) => console.error(error));
  });

  it('should delete address', () => {
    service
      .remove(2)
      .then(() => {
        expect(service.findAll()).toEqual(
          expect.not.arrayContaining(expect.objectContaining({ id: 2 })),
        );
      })
      .catch((error) => console.error(error));
  });
});
