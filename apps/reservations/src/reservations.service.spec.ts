import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepository: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
    findOneAndDelete: jest.Mock;
  };

  beforeEach(async () => {
    reservationsRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useValue: reservationsRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a reservation with timestamp and userId', async () => {
    const createReservationDto: CreateReservationDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };

    const createdReservation = {
      _id: 'reservation-1',
      ...createReservationDto,
      timestamp: new Date('2024-01-01T01:00:00.000Z'),
      userId: '123',
    };

    reservationsRepository.create.mockResolvedValue(createdReservation);

    const result = await service.create(createReservationDto);

    expect(reservationsRepository.create).toHaveBeenCalledWith({
      ...createReservationDto,
      timestamp: expect.any(Date) as unknown as Date,
      userId: '123',
    });
    expect(result).toBe(createdReservation);
  });

  it('propagates errors from create', async () => {
    const createReservationDto: CreateReservationDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };

    const error = new Error('create failed');
    reservationsRepository.create.mockRejectedValue(error);

    await expect(service.create(createReservationDto)).rejects.toBe(error);
  });

  it('returns all reservations', async () => {
    const reservations = [
      {
        _id: 'reservation-1',
        timestamp: new Date('2024-01-01T01:00:00.000Z'),
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        userId: '123',
        placeId: 'place-123',
        invoiceId: 'invoice-456',
      },
    ];

    reservationsRepository.find.mockResolvedValue(reservations);

    const result = await service.findAll();

    expect(reservationsRepository.find).toHaveBeenCalledWith({});
    expect(result).toBe(reservations);
  });

  it('propagates errors from findAll', async () => {
    const error = new Error('find failed');
    reservationsRepository.find.mockRejectedValue(error);

    await expect(service.findAll()).rejects.toBe(error);
  });

  it('returns a reservation by id', async () => {
    const reservation = {
      _id: 'reservation-1',
      timestamp: new Date('2024-01-01T01:00:00.000Z'),
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      userId: '123',
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };

    reservationsRepository.findOne.mockResolvedValue(reservation);

    const result = await service.findOne(reservation._id);

    expect(reservationsRepository.findOne).toHaveBeenCalledWith({
      _id: reservation._id,
    });
    expect(result).toBe(reservation);
  });

  it('propagates not found errors from findOne', async () => {
    const error = new NotFoundException('Document not found');
    reservationsRepository.findOne.mockRejectedValue(error);

    await expect(service.findOne('missing-id')).rejects.toBe(error);
  });

  it('updates a reservation by id', async () => {
    const reservationId = 'reservation-1';
    const updateReservationDto: UpdateReservationDto = {
      endDate: new Date('2024-01-03'),
      invoiceId: 'invoice-999',
    };

    const updatedReservation = {
      _id: reservationId,
      timestamp: new Date('2024-01-01T01:00:00.000Z'),
      startDate: new Date('2024-01-01'),
      endDate: updateReservationDto.endDate,
      userId: '123',
      placeId: 'place-123',
      invoiceId: updateReservationDto.invoiceId,
    };

    reservationsRepository.findOneAndUpdate.mockResolvedValue(
      updatedReservation,
    );

    const result = await service.update(reservationId, updateReservationDto);

    expect(reservationsRepository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: reservationId },
      { $set: { ...updateReservationDto } },
    );
    expect(result).toBe(updatedReservation);
  });

  it('propagates not found errors from update', async () => {
    const error = new NotFoundException('Document not found');
    reservationsRepository.findOneAndUpdate.mockRejectedValue(error);

    await expect(
      service.update('missing-id', { invoiceId: 'invoice-1' }),
    ).rejects.toBe(error);
  });

  it('removes a reservation by id', async () => {
    const reservation = {
      _id: 'reservation-1',
      timestamp: new Date('2024-01-01T01:00:00.000Z'),
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      userId: '123',
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };

    reservationsRepository.findOneAndDelete.mockResolvedValue(reservation);

    const result = await service.remove(reservation._id);

    expect(reservationsRepository.findOneAndDelete).toHaveBeenCalledWith({
      _id: reservation._id,
    });
    expect(result).toBe(reservation);
  });

  it('propagates not found errors from remove', async () => {
    const error = new NotFoundException('Document not found');
    reservationsRepository.findOneAndDelete.mockRejectedValue(error);

    await expect(service.remove('missing-id')).rejects.toBe(error);
  });
});
