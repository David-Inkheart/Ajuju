import { Request, Response } from 'express';
import AnswerController from './Answercontroller';
import request from 'supertest';
import app from '../server';

let mockRequest: jest.Mocked<Request>;
let mockResponse: jest.Mocked<Response>;

beforeEach(() => {
  