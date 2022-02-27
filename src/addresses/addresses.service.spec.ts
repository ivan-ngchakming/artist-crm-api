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
    create: (obj) => {
      const newAddrObj = { id: mockAddresses.length + 1, ...obj };
      mockAddresses.push(newAddrObj);
      return newAddrObj;
    },
    update: (id, obj) => {
      mockAddresses = [
        ...mockAddresses.filter((addr) => addr.id !== id),
        {
          ...mockAddresses.find((address) => address.id === id),
          ...obj,
        },
      ];
    },
    delete: (id) => {
      mockAddresses = mockAddresses.filter((addr) => addr.id !== id);
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

    mockAddresses = [
      { id: 1, lineOne: 'addr 1 line one', lineTwo: 'addr 1 line two' },
      { id: 2, lineOne: 'addr 2 line one', lineTwo: 'addr 2 line two' },
    ];
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

    return service.create(addressToBeCreated).then((data) => {
      expect(data).toEqual(expect.objectContaining(addressToBeCreated));
    });
  });

  it('should update address', () => {
    return service
      .update(2, { lineOne: 'updated address line 1' })
      .then((data) => {
        expect(data).toEqual(
          expect.objectContaining({ id: 2, lineOne: 'updated address line 1' }),
        );
      });
  });

  it('should delete address', () => {
    return service.remove(2).then(() => {
      expect(mockAddresses).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: 2 })]),
      );
    });
  });
});
