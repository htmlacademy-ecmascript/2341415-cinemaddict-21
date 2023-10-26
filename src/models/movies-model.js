import Publisher from '../framework/publisher.js';
import MoviesApi from '../api/movies-api.js';
import CommentsApi from '../api/comments-api.js';
import { keysToCamelCase } from '../utils.js';

const EVENTS = {
  MOVIES_CHANGED: 'movies.changed'
};

export default class MoviesModel extends Publisher {
  #moviesApi = new MoviesApi();
  #commentsApi = new CommentsApi();
  #movies;
  // key - movieID, value - array of comments
  #comments = new Map();

  async init() {
    const movies = await this.#moviesApi.getList();
    // const comments = await this.#commentsApi.getList();
    this.#movies = movies.map(keysToCamelCase);
    this._notify(EVENTS.MOVIES_CHANGED, this.#movies);

    await Promise.all(movies.map(({id}) => this.loadComments(id)));
  }

  // addComment(movieId, comment) {
  //   if(!this.#comments.has(movieId)) {
  //     this.#comments.set(movieId, []);
  //   }
  //   const comments = this.#comments.get(movieId);
  //   comments.push(comment);
  // }

  async loadComments(movieId) {
    const comments = await this.#commentsApi.getList(movieId);
    this.#comments.set(movieId, comments);
  }

  async getComments(movieId) {
    if(!this.#comments.has(movieId)) {
      await this.loadComments(movieId);
    }

    return this.#comments.get(movieId);
  }

  #createCommentsMap() {

  }

}

export {
  EVENTS,
};
