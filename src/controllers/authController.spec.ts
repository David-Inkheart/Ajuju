import { Request, Response } from 'express';
import AuthController from './Authcontroller';

let mockRequest: jest.Mocked<Request>;
let mockResponse: jest.Mocked<Response>;

beforeEach(() => {
  mockRequest = {
    body: {
      username: 'testuser',
      email: 'test@email.com',
      password: 'testpassword',
    },
  } as unknown as jest.Mocked<Request>;

  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as jest.Mocked<Response>;
});

describe('AuthController', () => {
  describe('register', () => {
    it('should return 400 if validation fails', async () => {
      mockRequest.body = {};
      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: '"username" is required',
      });
    });

    it.skip('should return 201 if user is created successfully', async () => {
      await AuthController.register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        token: expect.any(String),
      });
    });

    it('should return 409 if user already exists', async () => {
      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'User with same email or username already exists',
      });
    });
  });

  describe('login', () => {
    it('should return 400 if validation fails', async () => {
      mockRequest.body = {};
      await AuthController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: '"email" is required',
      });
    });

    it('should return 200 if user is logged in successfully', async () => {
      mockRequest.body = {
        email: 'test@email.com',
        password: 'testpassword',
      };
      await AuthController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User logged in successfully',
        token: expect.any(String),
      });
    });

    it('should return 401 if user does not exist', async () => {
      mockRequest.body = {
        email: 'johndoe@yahoomail.com',
        password: 'wrongpassword',
      };
      await AuthController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      mockRequest.body = {
        email: 'test@email.com',
        password: 'wrongpassword',
      };
      await AuthController.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid password',
      });
    });
  });
});
