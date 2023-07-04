import { Request, Response } from 'express';
import AppController from './Appcontroller';

let mockRequest: jest.Mocked<Request>;
let mockResponse: jest.Mocked<Response>;

beforeEach(() => {
  mockRequest = {} as jest.Mocked<Request>;
  mockResponse = {} as jest.Mocked<Response>;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('get home page', () => {
  it('should return a json object with a 200 status code', async () => {
    mockResponse.status = jest.fn().mockReturnValue(mockResponse);
    mockResponse.json = jest.fn().mockReturnValue(mockResponse);

    await AppController.getHome(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Ajuju: ask, know more, share!',
      data: {
        name: 'Ajuju',
        purpose: 'Ask, know more, share!',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'https://documenter.getpostman.com/view/randomnumber/randomnumber/ajuju-rest-api/',
      },
    });
  });
});
