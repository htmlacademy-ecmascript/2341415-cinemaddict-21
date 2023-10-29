import Publisher from '../framework/publisher.js';
import MoviesApi from '../api/movies-api.js';
import CommentsApi from '../api/comments-api.js';
import { keysToCamelCase } from '../utils.js';

const EVENTS = {
  DISPLAYED_MOVIES_ADDED: 'displayed_movies_added',
  ALL_MOVIES_DISPLAYED: 'all_movies_displayed'
};

export default class MoviesModel extends Publisher {
  #moviesApi = new MoviesApi();
  #commentsApi = new CommentsApi();
  #movies;
  #displayedMoviesCount;
  #displayedMovies = [];
  // key - movieID, value - array of comments
  #comments = new Map();

  constructor({ displayedMoviesCount }) {
    super();
    this.#displayedMoviesCount = displayedMoviesCount;
  }

  async init() {
    const movies = await this.#moviesApi.getList();
    this.#movies = movies.map(keysToCamelCase);
    this.addDisplayedMovies();
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

  async addDisplayedMovies() {
    const addingMovies = this.#movies.slice(this.#displayedMovies.length, this.#displayedMovies.length + this.#displayedMoviesCount);
    this.#displayedMovies = [...this.#displayedMovies, ...addingMovies];

    this._notify(EVENTS.DISPLAYED_MOVIES_ADDED, addingMovies);

    if (this.#displayedMovies.length >= this.#movies.length) {
      this._notify(EVENTS.ALL_MOVIES_DISPLAYED);
    }

    await Promise.all(addingMovies.map(({id}) => this.loadComments(id)));
  }

  #createCommentsMap() {

  }

}

export {
  EVENTS,
};
