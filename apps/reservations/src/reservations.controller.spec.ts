import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard, type UserDto } from '@app/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let reservationsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    reservationsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: reservationsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('create -> calls ReservationsService.create with dto and userId', async () => {
    const createReservationDto: CreateReservationDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };
    const user: UserDto = { _id: 'user-1' } as UserDto;

    reservationsService.create.mockResolvedValue({ _id: 'reservation-1' });

    await controller.create(createReservationDto, user);

    expect(reservationsService.create).toHaveBeenCalledWith(
      createReservationDto,
      user._id,
    );
  });

  it('create -> returns the service result', async () => {
    const createReservationDto: CreateReservationDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };
    const user: UserDto = { _id: 'user-1' } as UserDto;
    const createdReservation = {
      _id: 'reservation-1',
      ...createReservationDto,
      userId: user._id,
    };

    reservationsService.create.mockResolvedValue(createdReservation);

    const result = await controller.create(createReservationDto, user);

    expect(result).toBe(createdReservation);
  });

  it('create -> propagates service errors', async () => {
    const createReservationDto: CreateReservationDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      placeId: 'place-123',
      invoiceId: 'invoice-456',
    };
    const user: UserDto = { _id: 'user-1' } as UserDto;
    const error = new Error('create failed');

    reservationsService.create.mockRejectedValue(error);

    await expect(controller.create(createReservationDto, user)).rejects.toBe(
      error,
    );
  });

  it('findAll -> returns all reservations', async () => {
    const reservations = [{ _id: 'reservation-1' }];
    reservationsService.findAll.mockResolvedValue(reservations);

    const result = await controller.findAll();

    expect(reservationsService.findAll).toHaveBeenCalledWith();
    expect(result).toBe(reservations);
  });

  it('findOne -> returns reservation by id', async () => {
    const reservation = { _id: 'reservation-1' };
    reservationsService.findOne.mockResolvedValue(reservation);

    const result = await controller.findOne(reservation._id);

    expect(reservationsService.findOne).toHaveBeenCalledWith(reservation._id);
    expect(result).toBe(reservation);
  });

  it('update -> calls service with id and dto', async () => {
    const updateReservationDto: UpdateReservationDto = {
      endDate: new Date('2024-01-03'),
      invoiceId: 'invoice-999',
    };
    const reservationId = 'reservation-1';
    const updatedReservation = {
      _id: reservationId,
      ...updateReservationDto,
    };

    reservationsService.update.mockResolvedValue(updatedReservation);

    const result = await controller.update(reservationId, updateReservationDto);

    expect(reservationsService.update).toHaveBeenCalledWith(
      reservationId,
      updateReservationDto,
    );
    expect(result).toBe(updatedReservation);
  });

  it('remove -> calls service with id', async () => {
    const reservationId = 'reservation-1';
    const removedReservation = { _id: reservationId };

    reservationsService.remove.mockResolvedValue(removedReservation);

    const result = await controller.remove(reservationId);

    expect(reservationsService.remove).toHaveBeenCalledWith(reservationId);
    expect(result).toBe(removedReservation);
  });
});
