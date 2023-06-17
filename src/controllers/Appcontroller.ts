import { Request, Response } from 'express';

class AppController {
  static getHome(req: Request, res: Response) {
    try {
      res.status(200).json({
        success: true,
        message: 'Ajuju: Your instant answer hub!',
        data: {
          name: 'Ajuju',
          purpose: 'Your instant answer hub!',
          API: 'REST',
          version: '1.0.0',
          API_docs: 'https://documenter.getpostman.com/view/randomnumber/randomnumber/ajuju-rest-api/'
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'There was an error fetching the data',
        data: error
      })
    }
  }
}

export default AppController;