import AppController from './Appcontroller';

describe('get home', () => {
  it('should return the home page', () => {
    const response = AppController.getHome();

    expect(response).toEqual({
      success: true,
      message: 'API is online, welcome!',
      data: {
        name: 'Ajuju',
        purpose: 'Ask, know more, share!',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'https://documenter.getpostman.com/view/27102918/2s946bDajr',
      },
    });
  });
});
