import Publisher from '../framework/publisher.js';
import MoviesApi from '../api/movies-api.js';
import CommentsApi from '../api/comments-api.js';
import { keysToCamelCase } from '../utils.js';
import { FILTERTYPE } from '../const.js';

const EVENTS = {
  DISPLAYED_MOVIES_ADDED: 'displayed_movies_added',
  ALL_MOVIES_DISPLAYED: 'all_movies_displayed',
  DISPLAYED_MOVIES_CHANGED: 'displayed_movies_changed',
  FILTRED_MOVIES_CHANGED: 'filtred_movies_changed',
};

export default class MoviesModel extends Publisher {
  #moviesApi = new MoviesApi();
  #commentsApi = new CommentsApi();
  #movies;
  #displayedMoviesCount;
  #displayedMovies = [];
  // key - movieID, value - array of comments
  #comments = new Map();
  #selectedFilter = null;
  #watchMovies = [];
  #historyMovies = [];
  #favoriteMovies = [];

  constructor({ displayedMoviesCount }) {
    super();
    this.#displayedMoviesCount = displayedMoviesCount;
  }

  async init() {
    const movies = await this.#moviesApi.getList();
    this.#movies = movies.map(keysToCamelCase);
    this.addDisplayedMovies();
    this.#segregateMoviesByFilters();
  }

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

  setFilter(filterType) {
    this.#selectedFilter = filterType;
    this._notify(EVENTS.DISPLAYED_MOVIES_CHANGED, this.filtredMovies);
  }

  get filtredMoviesCount() {
    return {
      watchlistCount: this.#watchMovies.length,
      favoriteCount: this.#favoriteMovies.length,
      historyCount: this.#historyMovies.length,
    };
  }

  #segregateMoviesByFilters() {
    this.#watchMovies = [];
    this.#historyMovies = [];
    this.#favoriteMovies = [];

    for (const movie of this.#movies) {
      if (movie.userDetails.watchlist) {
        this.#watchMovies.push(movie);
      }
      if(movie.userDetails.favorite) {
        this.#favoriteMovies.push(movie);
      }
      if(movie.userDetails.alreadyWatched){
        this.#historyMovies.push(movie);
      }
    }
    this._notify(EVENTS.FILTRED_MOVIES_CHANGED, this.filtredMoviesCount);
  }

  get filtredMovies() {
    if(this.#selectedFilter === FILTERTYPE.FAVORITES) {
      return this.#favoriteMovies;
    }
    if(this.#selectedFilter === FILTERTYPE.HISTORY) {
      return this.#historyMovies;
    }
    if(this.#selectedFilter === FILTERTYPE.WATCHLIST) {
      return this.#watchMovies;
    }
    return this.#movies;
  }
}

export {
  EVENTS,
};
