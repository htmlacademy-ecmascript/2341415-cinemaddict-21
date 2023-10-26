import ApiService from '../framework/api-service.js';
import { auth, endPoint } from './server-const.js';

export default class MoviesApi extends ApiService {

  constructor() {
    super(endPoint, auth);
  }

  async getList() {
    const responce = await this._load({ url: 'cinemaddict/movies' });
    return ApiService.parseResponse(responce);
  }

}
