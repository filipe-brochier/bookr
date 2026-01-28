import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: {
    create: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    usersRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user with hashed password', async () => {
    const createUserDto: CreateUserDto = {
      email: 'user@example.com',
      password: 'plain-password',
    };

    const hashedPassword = 'hashed-password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    usersRepository.findOne.mockRejectedValue(new Error('not found'));

    const createdUser = {
      _id: 'user-1',
      ...createUserDto,
      password: hashedPassword,
    };
    usersRepository.create.mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);

    expect(usersRepository.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(usersRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: hashedPassword,
    });
    expect(result).toBe(createdUser);
  });

  it('throws UnprocessableEntityException when email already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'user@example.com',
      password: 'plain-password',
    };

    usersRepository.findOne.mockResolvedValue({
      _id: 'user-1',
      email: createUserDto.email,
    });

    await expect(service.create(createUserDto)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
    expect(usersRepository.create).not.toHaveBeenCalled();
  });

  it('validates user credentials', async () => {
    const email = 'user@example.com';
    const password = 'plain-password';
    const user = { _id: 'user-1', email, password: 'hashed' };

    usersRepository.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = (await service.validateUser(email, password)) as typeof user;

    expect(usersRepository.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(result).toBe(user);
  });

  it('throws UnauthorizedException for invalid credentials', async () => {
    const email = 'user@example.com';
    const password = 'plain-password';
    const user = { _id: 'user-1', email, password: 'hashed' };

    usersRepository.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.validateUser(email, password)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('returns a user by query', async () => {
    const getUserDto = { _id: 'user-1' };
    const user = { _id: 'user-1', email: 'user@example.com' };

    usersRepository.findOne.mockResolvedValue(user);

    const result = await service.getUser(getUserDto);

    expect(usersRepository.findOne).toHaveBeenCalledWith(getUserDto);
    expect(result).toBe(user);
  });
});
