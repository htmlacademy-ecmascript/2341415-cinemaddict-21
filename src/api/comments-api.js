import ApiService from '../framework/api-service.js';
import { auth, endPoint } from './server-const.js';

export default class CommentsApi extends ApiService {

  constructor() {
    super(endPoint, auth);
  }

  async getList(movieId) {
    const responce = await this._load({ url: `cinemaddict/comments/${movieId}` });
    return ApiService.parseResponse(responce);
  }

}
