import ApiService from '../framework/api-service.js';
import { auth, endPoint } from './server-const.js';
import { keysToCamelCase } from '../utils.js';
import { RESPONCE_STATUS } from '../const.js';

export default class CommentsApi extends ApiService {

  constructor() {
    super(endPoint, auth);
  }

  async getList(movieId) {
    const responce = await this._load({ url: `cinemaddict/comments/${movieId}` });
    return ApiService.parseResponse(responce);
  }

  async addComment(movieId, comment) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(comment);

    const response = await this._load({
      url: `cinemaddict/comments/${movieId}`,
      method: 'POST',
      headers,
      body
    });

    const responseData = await response.json();

    return keysToCamelCase(responseData);
  }

  async deleteComment(commentId) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const response = await this._load({
      url: `cinemaddict/comments/${commentId}`,
      method: 'DELETE',
      headers,
    });

    if(response.status !== RESPONCE_STATUS.SUCCESSFULY_DELETED) {
      throw new Error('comment deletion error');
    }
  }

}
