import ApiService from '../framework/api-service.js';
import { auth, endPoint } from './server-const.js';
import { keysToSnakeCase, keysToCamelCase } from '../utils.js';

export default class MoviesApi extends ApiService {

  constructor() {
    super(endPoint, auth);
  }

  async getList() {
    const responce = await this._load({ url: 'cinemaddict/movies' });
    return ApiService.parseResponse(responce);
  }

  async update(movieId, newMovie) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(keysToSnakeCase(newMovie));

    const response = await this._load({
      url: `cinemaddict/movies/${movieId}`,
      method: 'PUT',
      headers,
      body
    });

    const responseData = await response.json();

    return keysToCamelCase(responseData);
  }

}
