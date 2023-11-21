import MovieCardView from '../view/movie-card-view';
import NoMoviesView from '../view/no-movies-view.js';
import { EVENTS } from '../models/movies-model';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 0,
};

export default class MovieCardsPresenter {
  #cardsContainer = null;
  #popupPresenter = null;
  moviesModel = null;
  #movieViewMap = new Map();

  uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ movieCardsContainer, popupPresenter, moviesModel }) {
    this.#popupPresenter = popupPresenter;
    this.#cardsContainer = movieCardsContainer;
    this.moviesModel = moviesModel;

    this.moviesModel.addObserver(EVENTS.DISPLAYED_MOVIES_CHANGED, (displayedMovies) => {
      this.onDisplayedMoviesChanged(displayedMovies);
    });

    this.moviesModel.addObserver(EVENTS.MOVIE_UPDATED, (updatedMovie) => {
      const movieView = this.#movieViewMap.get(updatedMovie.id);
      movieView.updateElement({ movie: updatedMovie });
      this.uiBlocker.unblock();
    });

    this.moviesModel.addObserver(
      EVENTS.SELECTED_FILTER_CHANGED,
      () => this.#cardsContainer.clear()
    );
  }

  onDisplayedMoviesAdded(movies) {
    if (!movies.length) {
      this.#cardsContainer.add(new NoMoviesView(this.moviesModel.selectedFilter));
    }
    movies.forEach((movie) => this.#renderMovieCards(movie));
  }

  onDisplayedMoviesChanged(displayedMovies) {
    this.#cardsContainer.clear();
    this.onDisplayedMoviesAdded(displayedMovies);
  }

  #renderMovieCards(movie) {
    const onClick = async (theMovie) => {
      const comments = await this.moviesModel.getComments(theMovie.id);
      this.#cardsContainer.block();
      this.#popupPresenter.renderPopup({ movie: theMovie, comments, onClose: () => this.#cardsContainer.unblock() });
    };
    const onWatchinglistButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToWatchList(movieId).catch((err) => this.#handleError(movieId, err));
    };
    const onAlreadyWatchedlistButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToAlreadyWatchedList(movieId).catch((err) => this.#handleError(movieId, err));
    };
    const onFavoriteListButtonClick = (movieId) => {
      this.uiBlocker.block();
      this.moviesModel.switcIncludingToFavoriteList(movieId).catch((err) => this.#handleError(movieId, err));
    };
    const movieCardView = new MovieCardView(movie, { onClick, onWatchinglistButtonClick, onAlreadyWatchedlistButtonClick, onFavoriteListButtonClick});
    this.#movieViewMap.set(movie.id, movieCardView);
    this.#cardsContainer.add(movieCardView);
  }

  #handleError(movieId) {
    this.uiBlocker.unblock();
    const movieCardView = this.#movieViewMap.get(movieId);
    movieCardView.shake(() => movieCardView.updateElement({}));
  }

}
