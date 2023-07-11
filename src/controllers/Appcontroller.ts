class AppController {
  static getHome() {
    return {
      success: true,
      message: 'API is online, welcome!',
      data: {
        name: 'Ajuju',
        purpose: 'Ask, know more, share!',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'https://documenter.getpostman.com/view/27102918/2s946bDajr',
      },
    };
  }
}

export default AppController;
