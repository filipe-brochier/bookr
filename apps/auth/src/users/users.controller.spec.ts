import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { create: jest.Mock };
  const mockId = '697a0297d03b5a4516173263';

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('createUser -> calls UsersService.create with dto', async () => {
    const createUserDto: CreateUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    usersService.create.mockResolvedValue({ _id: mockId });

    await controller.createUser(createUserDto);

    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('createUser -> returns the service result', async () => {
    const createUserDto: CreateUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    const createdUser = { _id: mockId, ...createUserDto };
    usersService.create.mockResolvedValue(createdUser);

    const result = await controller.createUser(createUserDto);

    expect(result).toBe(createdUser);
  });

  it('createUser -> propagates service errors', async () => {
    const createUserDto: CreateUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    const error = new Error('create failed');
    usersService.create.mockRejectedValue(error);

    await expect(controller.createUser(createUserDto)).rejects.toBe(error);
  });

  it('getUser -> returns the current user from decorator', () => {
    const mockId = '697a0297d03b5a4516173261';

    const user: { _id: Types.ObjectId; email: string; password: string } = {
      _id: new Types.ObjectId(mockId),
      email: 'user@example.com',
      password: 'hashed-password',
    };

    const result = controller.getUser(user);

    expect(result).toBe(user);
  });
});
