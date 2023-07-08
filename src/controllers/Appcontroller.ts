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
        API_docs: 'https://documenter.getpostman.com/view/randomnumber/randomnumber/ajuju-rest-api/',
      },
    };
  }
}

export default AppController;
