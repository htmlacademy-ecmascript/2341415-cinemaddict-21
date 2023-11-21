import Publisher from '../framework/publisher.js';
import MoviesApi from '../api/movies-api.js';
import CommentsApi from '../api/comments-api.js';
import { keysToCamelCase } from '../utils.js';
import { FILTERTYPE, SORTING_ORDER } from '../const.js';

const EVENTS = {
  DISPLAYED_MOVIES_ADDED: 'displayed_movies_added',
  ALL_MOVIES_DISPLAYED: 'all_movies_displayed',
  DISPLAYED_MOVIES_CHANGED: 'displayed_movies_changed',
  FILTRED_MOVIES_CHANGED: 'filtred_movies_changed',
  MOVIE_UPDATED: 'movie_updated',
  SELECTED_FILTER_CHANGED: 'selected_filter_changed',
  MOVIES_PART_DISPLAYED: 'events.movies_part_displayed',
  SORTING_ORDER_CHANGED: 'sorting_order_changed',
  MODEL_INITIALIZED: 'model_initialized',
  MOVIE_COMMENT_ADDED: 'movie_comment_added',
  MOVIE_COMMENT_DELETED: 'movie_comment_deleted',
  MOVIES_LOADED: 'movies_loaded'
};

function getRelizeTimestamp(movie) {
  return new Date(movie.filmInfo.release.date).getTime();
}

const SORTERS = {
  [SORTING_ORDER.DEFAULT]: () => 0,
  [SORTING_ORDER.DATE]: (movieA, movieB) => getRelizeTimestamp(movieB) - getRelizeTimestamp(movieA),
  [SORTING_ORDER.RATING]: (movieA, movieB) => movieB.filmInfo.totalRating - movieA.filmInfo.totalRating,
};

export default class MoviesModel extends Publisher {
  #moviesApi = new MoviesApi();
  #commentsApi = new CommentsApi();
  #moviesMap = new Map();
  #displayedMoviesCount;
  #defaultDisplayedMoviesCount;
  #displayedMovies = [];
  // key - movieID, value - array of comments
  #comments = new Map();
  #selectedFilter = FILTERTYPE.ALL_MOVIES;
  #watchMovies = [];
  #historyMovies = [];
  #favoriteMovies = [];
  #sortingOrder = null;

  constructor({ displayedMoviesCount }) {
    super();
    this.#displayedMoviesCount = 0;
    this.#defaultDisplayedMoviesCount = displayedMoviesCount;
  }

  async init() {
    const movies = await this.#moviesApi.getList();
    this._notify(EVENTS.MOVIES_LOADED);
    movies.map(keysToCamelCase).forEach((movie) => this.#moviesMap.set(movie.id, movie));
    this.addDisplayedMovies();
    this.#segregateMoviesByFilters();
    this._notify(EVENTS.MODEL_INITIALIZED);
  }

  setSortingOrder(sortingOrder) {
    if (sortingOrder === this.#sortingOrder) {
      return;
    }

    this.#sortingOrder = sortingOrder;
    this._notify(EVENTS.DISPLAYED_MOVIES_CHANGED, this.sortedMovies.slice(0, this.#displayedMoviesCount));
    this._notify(EVENTS.SORTING_ORDER_CHANGED, this.#sortingOrder);
  }

  async loadComments(movieId) {
    const comments = await this.#commentsApi.getList(movieId);
    this.#comments.set(movieId, comments);
  }

  async addComment(movieId, comment) {
    const { movie, comments } = await this.#commentsApi.addComment(movieId, comment);
    this.#moviesMap.set(movieId, movie);
    this.#comments.set(movieId, comments);
    this._notify(EVENTS.MOVIE_UPDATED, movie);
    this._notify(EVENTS.MOVIE_COMMENT_ADDED, { movie, comments });
  }

  async deleteComment({ commentId, movieId }) {
    await this.#commentsApi.deleteComment(commentId);

    const movie = this.#moviesMap.get(movieId);
    movie.comments = movie.comments.filter((id) => id !== commentId);

    const comments = this.#comments.get(movieId);
    const newComments = comments.filter((comment) => comment.id !== commentId);
    this.#comments.set(movieId, newComments);

    this._notify(EVENTS.MOVIE_UPDATED, movie);
    this._notify(EVENTS.MOVIE_COMMENT_DELETED,{ movie, comments: newComments });
  }

  async getComments(movieId) {
    if(!this.#comments.has(movieId)) {
      await this.loadComments(movieId);
    }

    return this.#comments.get(movieId);
  }

  async addDisplayedMovies() {
    const newDisplayedMoviesCount = Math.min(this.#displayedMoviesCount + this.#defaultDisplayedMoviesCount, this.sortedMovies.length);

    if (this.#displayedMoviesCount === newDisplayedMoviesCount && this.#displayedMoviesCount !== 0) {
      this._notify(EVENTS.ALL_MOVIES_DISPLAYED);
      return;
    }

    const addingMovies = this.sortedMovies.slice(this.#displayedMoviesCount, newDisplayedMoviesCount);
    this.#displayedMoviesCount = newDisplayedMoviesCount;

    if (this.#displayedMoviesCount === this.sortedMovies.length) {
      this._notify(EVENTS.ALL_MOVIES_DISPLAYED);
    } else {
      this._notify(EVENTS.MOVIES_PART_DISPLAYED);
    }

    this._notify(EVENTS.DISPLAYED_MOVIES_ADDED, addingMovies);

    await Promise.all(addingMovies.map(({id}) => this.loadComments(id)));
  }

  get displayedMovies() {
    return this.filtredMovies.slice(0, this.#displayedMoviesCount);
  }

  get isFiltredMoviesEmpty() {
    return this.filtredMovies.length === 0;
  }

  setFilter(filterType) {
    this.#selectedFilter = filterType;
    this.#displayedMoviesCount = 0;
    this.setSortingOrder(SORTING_ORDER.DEFAULT);
    this._notify(EVENTS.SELECTED_FILTER_CHANGED, this.#selectedFilter);
    this.addDisplayedMovies();
  }

  get filtredMoviesCount() {
    return {
      watchlistCount: this.#watchMovies.length,
      favoriteCount: this.#favoriteMovies.length,
      historyCount: this.#historyMovies.length,
    };
  }

  get sortedMovies() {
    const sortMovies = SORTERS[this.#sortingOrder];
    return this.filtredMovies.sort(sortMovies);
  }

  get moviesLength() {
    return this.#moviesMap.size;
  }

  get selectedFilter() {
    return this.#selectedFilter;
  }

  get #movies() {
    return [...this.#moviesMap.values()];
  }

  async #switchFilterFlag(movieId, flagName) {
    const movie = this.#moviesMap.get(movieId);
    const newMovie = structuredClone(movie);
    newMovie.userDetails[flagName] = !newMovie.userDetails[flagName];
    const updatedMovie = await this.#moviesApi.update(movieId, newMovie);
    this.#moviesMap.set(movieId, updatedMovie);
    this.#segregateMoviesByFilters();
    this._notify(EVENTS.MOVIE_UPDATED, updatedMovie);
  }

  async switcIncludingToWatchList(movieId) {
    await this.#switchFilterFlag(movieId, 'watchlist');

    if (this.#selectedFilter === FILTERTYPE.WATCHLIST) {
      this._notify(EVENTS.DISPLAYED_MOVIES_CHANGED, this.displayedMovies);
    }
  }

  async switcIncludingToAlreadyWatchedList(movieId) {
    await this.#switchFilterFlag(movieId, 'alreadyWatched');

    if (this.#selectedFilter === FILTERTYPE.HISTORY) {
      this._notify(EVENTS.DISPLAYED_MOVIES_CHANGED, this.displayedMovies);
    }
  }

  async switcIncludingToFavoriteList(movieId) {
    await this.#switchFilterFlag(movieId, 'favorite');

    if (this.#selectedFilter === FILTERTYPE.FAVORITES) {
      this._notify(EVENTS.DISPLAYED_MOVIES_CHANGED, this.displayedMovies);
    }
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

    this._notify(EVENTS.FILTRED_MOVIES_CHANGED, { counts: this.filtredMoviesCount, selectedFilter: this.#selectedFilter });
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
